"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[18px] border border-transparent text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary/70 bg-[linear-gradient(135deg,#1d7e78_0%,#205f7d_100%)] text-primary-foreground shadow-[0_18px_34px_rgba(29,126,120,0.24)] hover:-translate-y-0.5 hover:brightness-105",
        outline:
          "border-border/80 bg-white/60 text-foreground shadow-[0_12px_24px_rgba(18,36,60,0.06)] hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/85 aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/40 dark:hover:bg-input/70",
        secondary:
          "border-secondary/80 bg-secondary text-secondary-foreground shadow-[0_10px_24px_rgba(79,61,34,0.08)] hover:-translate-y-0.5 hover:bg-[#f5ead6] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground dark:border-[#5e4e33] dark:bg-[#2a3750] dark:text-[#f2e2c1]",
        ghost:
          "text-muted-foreground hover:bg-white/55 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/60",
        destructive:
          "border-destructive/20 bg-destructive text-destructive-foreground shadow-[0_16px_30px_rgba(217,85,85,0.22)] hover:-translate-y-0.5 hover:brightness-105 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-[14px] px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[16px] px-3 text-[0.82rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5 text-[0.95rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-8",
        "icon-xs":
          "size-7 rounded-[14px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[16px]",
        "icon-lg": "size-10 rounded-[20px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
