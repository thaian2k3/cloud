import { useForm } from "react-hook-form";
import { useCreateBooking } from "./useCreateBooking";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import supabase from "../../services/supabase";
import { isBefore, isFuture, isPast, isToday, parseISO } from "date-fns";
import { subtractDates } from "../../utils/helpers";
import { useCabins } from "../cabins/useCabins";
import Checkbox from "../../ui/Checkbox";
import Option from "../../ui/Option";
import Select from "../../ui/Select";
import SelectNoProps from "../../ui/SelectNoProps";

function CreateBookingForm({ onCloseModal }) {
	const {
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm();
	const { isCreating, createBooking } = useCreateBooking();
	const { cabins, loading: loadingCabins } = useCabins();

	async function onSubmit(booking) {
		const { data: guestsIds } = await supabase
			.from("guests")
			.select("id")
			.order("id");
		const allGuestIds = guestsIds.map((guest) => guest.id);

		const { data: cabin } = await supabase
			.from("cabins")
			.select("*")
			.eq("id", booking.cabinId);

		// Calculate the total price and status of the booking
		const numNights = subtractDates(booking.endDate, booking.startDate);
		const cabinPrice =
			numNights * (cabin[0].regularPrice - cabin[0].discount);
		const extrasPrice = booking.hasBreakfast
			? numNights * 15 * booking.numGuests
			: 0; // hardcoded breakfast price
		const totalPrice = cabinPrice + extrasPrice;

		let status;
		if (
			isPast(new Date(booking.endDate)) &&
			!isToday(new Date(booking.endDate))
		)
			status = "checked-out";
		if (
			isFuture(new Date(booking.startDate)) ||
			isToday(new Date(booking.startDate))
		)
			status = "unconfirmed";
		if (
			(isFuture(new Date(booking.endDate)) ||
				isToday(new Date(booking.endDate))) &&
			isPast(new Date(booking.startDate))
		)
			status = "checked-in";

		console.log(booking.guestId - 1, allGuestIds.at(booking.guestId - 1));
		createBooking(
			{
				...booking,
				numNights,
				cabinPrice,
				extrasPrice,
				totalPrice,
				guestId: booking.guestId,
				cabinId: booking.cabinId,
				status,
			},
			{
				onSuccess: (data) => {
					reset();
					onCloseModal?.();
				},
			}
		);
	}

	return (
		<Form
			onSubmit={handleSubmit(onSubmit)}
			type={onCloseModal ? "modal" : "regular"}
		>
			<FormRow label="Start date" error={errors?.startDate?.message}>
				<Input
					type="date"
					id="startDate"
					disabled={isCreating}
					{...register("startDate", {
						required: "Start date is required",
					})}
				/>
			</FormRow>

			<FormRow label="End date" error={errors?.endDate?.message}>
				<Input
					type="date"
					id="endDate"
					disabled={isCreating}
					{...register("endDate", {
						required: "End date is required",
						validate: (value) =>
							isBefore(
								parseISO(getValues().startDate),
								parseISO(value)
							) || "End date must be later than start date",
					})}
				/>
			</FormRow>

			<FormRow
				label="Number of guests"
				error={errors?.numGuests?.message}
			>
				<Input
					type="number"
					id="numGuests"
					disabled={isCreating}
					defaultValue={0}
					{...register("numGuests", {
						required: "Number of guests is required",
						validate: (value) =>
							value > 0 || "Must be greater than 0",
					})}
				/>
			</FormRow>

			<FormRow
				label="Has breakfast"
				error={errors?.hasBreakfast?.message}
			>
				{/* <Input
					type="checkbox"
					id="hasBreakfast"
					disabled={isCreating}
					{...register("hasBreakfast")}
				/> */}
				<Checkbox
					id="hasBreakfast"
					disabled={isCreating}
					{...register("hasBreakfast")}
				></Checkbox>
			</FormRow>

			<FormRow label="Guest ID" error={errors?.name?.message}>
				<Input
					type="number"
					id="guestId"
					disabled={isCreating}
					{...register("guestId", {
						required: "Guest ID is required",
					})}
				/>
			</FormRow>

			<FormRow label="Cabin ID" error={errors?.cabinId?.message}>
				<SelectNoProps
					id="cabinId"
					disabled={isCreating || loadingCabins}
					{...register("cabinId", {
						required: "Cabin ID is required",
					})}
				>
					{cabins.map((cabin) => (
						<Option value={cabin.id} key={cabin.id}>
							{cabin.id}
						</Option>
					))}
				</SelectNoProps>
			</FormRow>

			<FormRow label="Observations" error={errors?.observations?.message}>
				<Textarea
					type="text"
					id="observations"
					disabled={isCreating}
					defaultValue=""
					{...register("observations")}
				/>
			</FormRow>

			<FormRow>
				{/* type is an HTML attribute! */}
				<Button
					variation="secondary"
					type="reset"
					onClick={() => onCloseModal?.()}
				>
					Cancel
				</Button>
				<Button disabled={isCreating}>Create new booking</Button>
			</FormRow>
		</Form>
	);
}

export default CreateBookingForm;
