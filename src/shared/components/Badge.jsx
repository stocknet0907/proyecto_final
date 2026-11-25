import React from 'react';
import { cn } from '../utils/cn';

export const Badge = ({ children, variant = 'neutral', size = 'sm', className }) => {
  const variants = {
    neutral: 'bg-surface-container text-ink-muted border-borderline',
    primary: 'bg-primary-light text-primary dark:text-primary-dark border-primary/30',
    secondary: 'bg-secondary-light text-secondary-dark border-secondary/40 font-semibold',
    success: 'bg-status-success-bg text-status-success border-status-success-border font-medium',
    warning: 'bg-status-warning-bg text-status-warning border-status-warning-border font-medium',
    error: 'bg-status-error-bg text-status-error border-status-error-border font-medium',
    info: 'bg-status-info-bg text-status-info border-status-info-border font-medium',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded',
    sm: 'text-xs px-2 py-0.5 rounded-sm',
    md: 'text-sm px-2.5 py-1 rounded-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border border-solid font-sans whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
