import { useEffect, useRef } from 'react';

export const useViewedOnce = (onView: () => void) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const viewed = useRef(false);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !viewed.current) {
					viewed.current = true;
					onView();
				}
			},
			{ threshold: 0.4 } // карточка видна хотя бы на 40%
		);

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, []);

	return ref;
};
