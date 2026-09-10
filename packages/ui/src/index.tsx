import type { ReactNode } from "react";
export function Logo() { return <div className="logo"><span>D</span><strong>DPL</strong></div>; }
export function SectionHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) { return <div className="section-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="description">{description}</p>}</div>{action}</div>; }
