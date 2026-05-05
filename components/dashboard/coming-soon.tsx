import type { ReactNode } from "react";

type ComingSoonProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function ComingSoon({ title, description, action }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Segera Hadir
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}
