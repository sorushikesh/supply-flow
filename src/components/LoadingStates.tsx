import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="flex items-center gap-4 animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <Loader2 
            className="h-8 w-8 animate-spin mx-auto text-primary/50 absolute inset-0" 
            style={{ animationDuration: '0.6s', animationDirection: 'reverse' }} 
          />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0ms' }}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '75ms' }}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}
