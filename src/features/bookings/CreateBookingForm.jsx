import { useForm } from "react-hook-form";
import { useCreateBooking } from "./useCreateBooking";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import supabase from "../../services/supabase";
import { isBefore, isFuture, isPast, isToday, parseISO } from "date-fns";
import { getCountryCode, subtractDates } from "../../utils/helpers";
import { useCabins } from "../cabins/useCabins";
import Option from "../../ui/Option";
import SelectNoProps from "../../ui/SelectNoProps";
import { useCreateGuest } from "../guests/useCreateGuest";
import { useEditGuest } from "../guests/useEditGuest";
import { useCountriesName } from "./useCountriesName";

function CreateBookingForm({ onCloseModal }) {
	const {
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm();
	const { isCreating, createBooking } = useCreateBooking();
	const { createGuest } = useCreateGuest();
	const { editGuest } = useEditGuest();
	const { cabins, isLoading: loadingCabins } = useCabins();
	const { countriesName, isLoading: loadingCountriesName } =
		useCountriesName();

	if (loadingCabins || loadingCountriesName) return <Spinner />;

	async function onSubmit(data) {
		const guestData = {
			email: data.email,
			nationalId: data.nationalId,
			fullName: data.fullName,
			countryFlag: `https://flagcdn.com/${await getCountryCode(
				data.nationality
			)}.svg`,
			nationality: data.nationality,
		};

		//Lay data guest
		let { data: guest } = await supabase
			.from("guests")
			.select("*")
			.eq("email", data.email)
			.single();

		if (guest) {
			editGuest({
				newGuestData: guestData,
				id: guest.id,
			});
		} else {
			createGuest(guestData);
		}
		let { data: lastedGuest } = await supabase
			.from("guests")
			.select("*")
			.eq("email", data.email)
			.single();

		console.log(lastedGuest);
		const lastedGuestId = lastedGuest.id;

		// Lay data cabin
		const { data: cabin } = await supabase
			.from("cabins")
			.select("*")
			.eq("id", data.cabinId);

		const numNights = subtractDates(data.endDate, data.startDate);
		const cabinPrice =
			numNights * (cabin[0].regularPrice - cabin[0].discount);
		const extrasPrice = data.hasBreakfast
			? numNights * 15 * data.numGuests
			: 0;
		const totalPrice = cabinPrice + extrasPrice;

		let status;
		if (isPast(new Date(data.endDate)) && !isToday(new Date(data.endDate)))
			status = "checked-out";
		if (
			isFuture(new Date(data.startDate)) ||
			isToday(new Date(data.startDate))
		)
			status = "unconfirmed";
		if (
			(isFuture(new Date(data.endDate)) ||
				isToday(new Date(data.endDate))) &&
			isPast(new Date(data.startDate))
		)
			status = "checked-in";

		createBooking(
			{
				startDate: data.startDate,
				endDate: data.endDate,
				numGuests: data.numGuests,
				hasBreakfast: data.hasBreakfast,
				numNights,
				cabinPrice,
				extrasPrice,
				totalPrice,
				guestId: lastedGuestId,
				cabinId: data.cabinId,
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
			<FormRow label="Guest name" error={errors?.fullName?.message}>
				<Input
					type="text"
					id="fullName"
					disabled={isCreating}
					{...register("fullName", {
						required: "Guest name is required",
					})}
				/>
			</FormRow>

			<FormRow label="Guest email" error={errors?.email?.message}>
				<Input
					type="email"
					id="email"
					disabled={isCreating}
					{...register("email", {
						required: "Guest email is required",
					})}
				/>
			</FormRow>

			<FormRow
				label="Guest national ID"
				error={errors?.nationalId?.message}
			>
				<Input
					type="text"
					id="nationalId"
					disabled={isCreating}
					{...register("nationalId", {
						required: "Guest national ID is required",
					})}
				/>
			</FormRow>

			<FormRow
				label="Guest nationality"
				error={errors?.nationality?.message}
			>
				<SelectNoProps
					id="nationality"
					disabled={loadingCountriesName || isCreating}
					{...register("nationality", {
						required: "Guest nationality is required",
					})}
				>
					{countriesName?.map((countryName) => (
						<Option value={countryName} key={countryName}>
							{countryName}
						</Option>
					))}
				</SelectNoProps>
			</FormRow>

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
				<Input
					type="checkbox"
					id="hasBreakfast"
					disabled={isCreating}
					{...register("hasBreakfast")}
				/>
				{/* <Checkbox
					id="hasBreakfast"
					disabled={isCreating}
					checked={true}
					{...register("hasBreakfast")}
				></Checkbox> */}
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
