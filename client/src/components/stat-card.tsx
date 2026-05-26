import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  variant: "primary" | "secondary";
  isLoading?: boolean;
}

export function StatCard({ label, value, unit, icon: Icon, variant, isLoading }: StatCardProps) {
  const colorClass = variant === "primary" ? "text-primary" : "text-secondary";
  const bgClass = variant === "primary" ? "bg-primary/10" : "bg-secondary/10";
  const ringClass = variant === "primary" ? "ring-primary/20" : "ring-secondary/20";

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-5 border border-border/50 bg-white shadow-sm transition-all duration-300 hover:shadow-md",
      isLoading && "animate-pulse"
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            ) : (
              <>
                <h3 className={cn("text-3xl font-bold font-display tracking-tight", colorClass)}>
                  {Math.round(value)}
                </h3>
                <span className="text-sm font-medium text-muted-foreground">{unit}</span>
              </>
            )}
          </div>
        </div>
        <div className={cn("p-3 rounded-xl ring-4", bgClass, ringClass)}>
          <Icon className={cn("w-5 h-5", colorClass)} />
        </div>
      </div>
      
      {/* Decorative background shape */}
      <div className={cn(
        "absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-[0.03] pointer-events-none",
        variant === "primary" ? "bg-primary" : "bg-secondary"
      )} />
    </div>
  );
}
