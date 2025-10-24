import { useEffect } from "react";

export const YandexMetrika = ({ counterId }: { counterId: number }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).ym =
        (window as any).ym ||
        function () {
          ((window as any).ym.a = (window as any).ym.a || []).push(arguments);
        };

      (window as any).ym(counterId, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    };
  }, [counterId]);

  return null;
};
