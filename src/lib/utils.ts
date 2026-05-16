import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) =>
  price === 0 ? "Free" : `$${price.toFixed(2)}`;

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

export const truncate = (str: string, len: number) =>
  str.length > len ? str.substring(0, len) + "..." : str;

export const getLevelColor = (level: string) => ({
  BEGINNER: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  INTERMEDIATE: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
  ADVANCED: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
})[level] || "text-gray-600 bg-gray-100";
