import React from 'react';
import { Card } from '../../../shared/components/Card';
import { cn } from '../../../shared/utils/cn';

export const KpiCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'primary',
  trend,
  className,
}) => {
  const iconVariants = {
    primary: 'bg-primary-light text-primary',
    secondary: 'bg-secondary-light text-secondary-dark',
    success: 'bg-status-success-bg text-status-success',
    warning: 'bg-status-warning-bg text-status-warning',
    error: 'bg-status-error-bg text-status-error',
  };

  return (
    <Card className={cn('flex flex-col justify-between p-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-ink-muted block">{title}</span>
          <span className="font-display font-bold text-xl sm:text-2xl text-ink-base font-mono tracking-tight block mt-1">
            {value}
          </span>
        </div>
        <div
          className={cn(
            'w-10 h-10 rounded-sm flex items-center justify-center shrink-0',
            iconVariants[variant]
          )}
        >
          {Icon && <Icon className="w-5 h-5 stroke-[1.8]" />}
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-3 pt-2 border-t border-borderline/60 flex items-center justify-between text-[11px]">
          <span className="text-ink-muted">{subtext}</span>
          {trend && (
            <span
              className={cn(
                'font-semibold font-mono',
                trend.isPositive ? 'text-status-success' : 'text-status-error'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
