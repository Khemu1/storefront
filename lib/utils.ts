import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getCdnUrl = () => {
  return process.env.NEXT_PUBLIC_CDN_URL || "";
};
