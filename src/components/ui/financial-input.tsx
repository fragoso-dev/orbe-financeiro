import * as React from "react"
import { cn } from "@/lib/utils"

export interface FinancialInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const FinancialInput = React.forwardRef<HTMLInputElement, FinancialInputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-smooth",
              icon && "pl-10",
              error && "border-danger focus-visible:ring-danger",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
      </div>
    )
  }
)
FinancialInput.displayName = "FinancialInput"

export { FinancialInput }