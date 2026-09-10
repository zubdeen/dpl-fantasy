import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = { title: "DPL Admin | Botswana", description: "DPL Fantasy administration" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
