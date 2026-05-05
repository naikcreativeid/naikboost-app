import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <Skeleton className="h-16 rounded-[999px]" />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Skeleton className="h-[420px] rounded-[2rem]" />
          <Skeleton className="h-[420px] rounded-[2rem]" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-52 rounded-[2rem]" />
          <Skeleton className="h-52 rounded-[2rem]" />
          <Skeleton className="h-52 rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}
