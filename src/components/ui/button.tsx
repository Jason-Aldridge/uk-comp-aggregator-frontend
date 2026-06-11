import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-rr-green text-rr-on-accent border border-transparent hover:opacity-90",
  secondary:
    "bg-transparent border border-rr-border text-rr-secondary hover:bg-rr-elevated",
  icon: "bg-rr-elevated border border-rr-border text-rr-secondary hover:opacity-90 h-9 w-9 p-0 inline-flex items-center justify-center rounded-md",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer";

  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}