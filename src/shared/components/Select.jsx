import React from 'react';
import { cn } from '../utils/cn';

export const Select = React.forwardRef(
  ({ className, label, error, helperText, options = [], children, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label className="text-xs font-semibold text-ink-base select-none">
            {label}
            {props.required && <span className="text-status-error ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full bg-surface-lowest text-ink-base text-sm border border-borderline rounded-sm py-2 px-3 transition-colors cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'disabled:bg-surface-container disabled:text-ink-muted disabled:cursor-not-allowed',
            error && 'border-status-error focus:ring-status-error',
            className
          )}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error ? (
          <span className="text-xs text-status-error font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-ink-muted">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
