import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight" | "success" | "warning" | "error";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 shadow-sm",
        variant === "default" && "bg-white border-gray-200",
        variant === "highlight" && "bg-blue-50 border-blue-200",
        variant === "success" && "bg-green-50 border-green-200",
        variant === "warning" && "bg-yellow-50 border-yellow-200",
        variant === "error" && "bg-red-50 border-red-200",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-semibold text-gray-900 text-base mb-3", className)} {...props} />
  );
}

export function CardSection({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-gray-100", className)} {...props} />
  );
}
