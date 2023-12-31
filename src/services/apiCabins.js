import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
	const { data, error } = await supabase.from("cabins").select("*");

	if (error) {
		console.error(error);
		throw new Error("Cabins cound not be loaded");
	}
	return data;
}

export async function createEditCabin(newCabin, id) {
	const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
	const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
		"/",
		""
	);
	
	// Tao duong dan image
	const imagePath = hasImagePath
		? newCabin.image
		: `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
	//https://nmzahnenphtqtxsbxjsh.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
	//1. Create/edit cabin
	let query = supabase.from("cabins");

	//A) TAO
	if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

	//B) SUA
	if (id)
		query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
	const { data, error } = await query.select().single();

	if (error) {
		console.error(error);
		throw new Error("Cabins cound not be created");
	}

	//2. TAI ANH LEN
	if (hasImagePath) return data;
	const { error: storageError } = await supabase.storage
		.from("cabin-images")
		.upload(imageName, newCabin.image);

	//3. XOA DI CABIN NEU NHU ANH KHONG TAI LEN DUOC
	if (storageError) {
		await supabase.from("cabins").delete().eq("id", data.id);
		console.error(storageError);
		throw new Error("Cabins image cound not be uploaded");
	}
}

export async function deleteCabin(id) {
	const { data, error } = await supabase.from("cabins").delete().eq("id", id);

	if (error) {
		console.error(error);
		throw new Error("Cabins cound not be deleted");
	}

	return data;
}
