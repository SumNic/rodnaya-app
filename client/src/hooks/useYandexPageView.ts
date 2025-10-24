import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useYandexPageView = (counterId: number) => {
    const location = useLocation();
    useEffect(() => {
        if ((window as any).ym) {
            (window as any).ym(counterId, "hit", location.pathname + location.search);
        }
    }, [location, counterId]);
};
