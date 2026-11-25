import React from 'react';
import { cn } from '../utils/cn';

export const Card = ({ className, children, title, subtitle, headerAction, ...props }) => {
  return (
    <div
      className={cn(
        'bg-surface-lowest border border-borderline rounded-lg p-5 shadow-subtle',
        className
      )}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-borderline/60">
          <div>
            {title && <h3 className="font-display font-semibold text-base text-ink-base">{title}</h3>}
            {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
