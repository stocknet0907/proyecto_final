import React from 'react';
import { cn } from '../utils/cn';

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'md', children, disabled, type = 'button', icon: Icon, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary shadow-subtle',
      secondary: 'bg-secondary hover:bg-secondary-hover text-ink-base font-bold focus:ring-secondary shadow-subtle',
      outline: 'bg-transparent border border-borderline hover:bg-surface-container text-ink-base focus:ring-primary',
      ghost: 'bg-transparent hover:bg-surface-container text-ink-muted hover:text-ink-base focus:ring-primary',
      danger: 'bg-status-error hover:bg-red-700 text-white focus:ring-red-500 shadow-subtle',
      'danger-outline': 'bg-transparent border border-status-error text-status-error hover:bg-status-error-bg focus:ring-status-error',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 rounded-sm gap-1.5 h-8',
      md: 'text-sm px-3.5 py-2 rounded-sm gap-2 h-9',
      lg: 'text-base px-5 py-2.5 rounded-md gap-2.5 h-11',
      icon: 'p-2 rounded-sm h-9 w-9',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
