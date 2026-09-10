import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = { title: "DPL Fantasy | Botswana", description: "Private fantasy padel league for Diamond Padel League Botswana" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
