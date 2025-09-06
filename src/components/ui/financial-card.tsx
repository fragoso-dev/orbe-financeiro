import * as React from "react"
import { cn } from "@/lib/utils"

const FinancialCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    elevated?: boolean
  }
>(({ className, elevated = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "financial-card",
      elevated && "financial-card-elevated",
      className
    )}
    {...props}
  />
))
FinancialCard.displayName = "FinancialCard"

const FinancialCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
FinancialCardHeader.displayName = "FinancialCardHeader"

const FinancialCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-foreground", className)}
    {...props}
  />
))
FinancialCardTitle.displayName = "FinancialCardTitle"

const FinancialCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FinancialCardDescription.displayName = "FinancialCardDescription"

const FinancialCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
FinancialCardContent.displayName = "FinancialCardContent"

const FinancialCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
FinancialCardFooter.displayName = "FinancialCardFooter"

export {
  FinancialCard,
  FinancialCardHeader,
  FinancialCardFooter,
  FinancialCardTitle,
  FinancialCardDescription,
  FinancialCardContent,
}