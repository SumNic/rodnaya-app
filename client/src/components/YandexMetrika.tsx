import { useEffect } from "react";

declare global {
  interface Window {
    ym: (...args: any[]) => void;
  }
}

interface YandexMetrikaProps {
  counterId: string | number;
}

export const YandexMetrika = ({ counterId }: YandexMetrikaProps) => {
  useEffect(() => {
    // Если скрипт уже загружен, просто инициализируем счетчик
    if (window.ym) {
      window.ym(counterId, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;
    script.async = true;

    // Инициализация очереди до загрузки скрипта
    window.ym = function (...args: any[]) {
      ((window as any).ym.a = (window as any).ym.a || []).push(args);
    };

    // Обработка успешной загрузки
    script.onload = () => {
      window.ym(counterId, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    };

    // Обработка ошибок
    script.onerror = () => {
      console.error("Failed to load Yandex Metrika script");
    };

    document.head.appendChild(script);

    // Cleanup функция
    return () => {
      // Можно добавить вызов trackPage для фиксации ухода со страницы
      if (window.ym) {
        window.ym(counterId, "hit", window.location.pathname);
      }
    };
  }, [counterId]);

  return null;
};