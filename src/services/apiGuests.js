import supabase from "./supabase";

export async function getGuests() {
	const { data, error } = await supabase.from("guests").select("*").single();
	if (error) {
		console.error(error);
		throw new Error("Guests could not be loaded");
	}
	return data;
}

export async function createEditGuest(newGuest, id) {
	//1. Create/edit guest
	let query = supabase.from("guests");

	//A) TAO
	if (!id) query = query.insert([{ ...newGuest }]);

	//B) SUA
	if (id) query = query.update({ ...newGuest }).eq("id", id);
	const { data, error } = await query.select().single();

	if (error) {
		console.error(error);
		throw new Error("Guests cound not be edited");
	}

	return data;
}

export async function createGuest1(guestData) {
	const { data, error } = await supabase
		.from("guests")
		.upsert(guestData)
		.select();

	if (error) {
		console.error(error);
		throw new Error("Guests could not be created or edited");
	}
	return data;
}
