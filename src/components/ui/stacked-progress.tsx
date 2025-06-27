"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StackedProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    value: number
    color: string
    tooltip: React.ReactNode
  }[]
}

const StackedProgress = React.forwardRef<HTMLDivElement, StackedProgressProps>(
  ({ className, data, ...props }, ref) => {
    // Filter out items with 0 value to avoid rendering empty divs
    const validData = data.filter(item => item.value > 0);

    return (
      <TooltipProvider>
        <div
          ref={ref}
          className={cn(
            "relative flex h-2 w-full overflow-hidden rounded-full bg-secondary",
            className
          )}
          {...props}
        >
          {validData.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn("h-full transition-all", item.color)}
                  style={{ width: `${item.value}%` }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    )
  }
)
StackedProgress.displayName = "StackedProgress"

export { StackedProgress }
