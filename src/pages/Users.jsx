import SignupForm from "../features/authentication/SignupForm";
import Heading from "../ui/Heading";

// Tao trang NewUsers
function NewUsers() {
	return (
		<>
			<Heading as="h1">Create a new user</Heading>
			<SignupForm />
		</>
	);
}

export default NewUsers;
