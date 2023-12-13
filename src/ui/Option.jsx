import styled from "styled-components";

const Option = styled.option`
	border: 1px solid var(--color-grey-300);
	background-color: var(--color-grey-0);
	border-radius: var(--border-radius-sm);
	padding: 0.8rem 1.2rem;
	box-shadow: var(--shadow-sm);
	&::placeholder {
		color: var(--color-grey-500);
	}
	&:focus {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
	}
`;

export default Option;
