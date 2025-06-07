import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      {
        'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
        'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700': variant === 'secondary',
        'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800': variant === 'outline',
        'hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
      },
      {
        'h-10 py-2 px-4': size === 'default',
        'h-9 px-3 rounded-md': size === 'sm',
        'h-11 px-8 rounded-md': size === 'lg',
      },
      className
    )

    return (
      <button
        className={baseStyles}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button } 