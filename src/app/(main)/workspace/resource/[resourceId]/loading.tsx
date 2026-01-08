import { Skeleton } from "@/components/ui/skeleton";

export default function ResourceLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-64" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-20" />
          <span className="text-muted-foreground">•</span>
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
