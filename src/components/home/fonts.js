import { Barlow, Caveat } from "next/font/google";

export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
});