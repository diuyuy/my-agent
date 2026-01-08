import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <T>(
  cb: (...args: T[]) => void,
  delay: number = 1000
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: T[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      cb(...args);
      timer = null;
    }, delay);
  };
};
