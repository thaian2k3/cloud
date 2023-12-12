import { useEffect, useRef } from "react";

// Tao custom hook de xu ly click ngoai element
export function useOutsideClick(handler, listenCapturing = true) {
	const ref = useRef();

	useEffect(
		function () {
			function handleClick(e) {
				if (ref.current && !ref.current.contains(e.target)) {
					handler();
				}
			}
			document.addEventListener("click", handleClick, listenCapturing);

			return () =>
				document.removeEventListener(
					"click",
					handleClick,
					listenCapturing
				);
		},
		[handler, listenCapturing]
	);

	return ref;
}
