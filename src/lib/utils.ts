import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function hslaToRGBA(hslaString) {
  // Create a temporary div to use the browser's color conversion
  const div = document.createElement("div");
  div.style.color = hslaString;
  document.body.appendChild(div);

  // Get the computed RGB values
  const rgbaColor = window.getComputedStyle(div).color;
  document.body.removeChild(div);

  // Extract RGBA values (converting alpha to 0-255 range)
  const [r, g, b, a] = rgbaColor.match(/[\d.]+/g).map(Number);
  return [r, g, b, Math.round(a * 255)];
}