import React from 'react';
import { cn } from '../utils/cn';

export const Input = React.forwardRef(
  ({ className, type = 'text', label, error, helperText, icon: Icon, rightIcon: RightIcon, onRightIconClick, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label className="text-xs font-semibold text-ink-base select-none">
            {label}
            {props.required && <span className="text-status-error ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3 text-ink-muted pointer-events-none flex items-center">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-surface-lowest text-ink-base text-sm placeholder:text-ink-muted/60 border border-borderline rounded-sm py-2 px-3 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
              'disabled:bg-surface-container disabled:text-ink-muted disabled:cursor-not-allowed',
              Icon && 'pl-9',
              RightIcon && 'pr-9',
              error && 'border-status-error focus:ring-status-error focus:border-status-error',
              className
            )}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 text-ink-muted hover:text-ink-base flex items-center"
            >
              <RightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        {error ? (
          <span className="text-xs text-status-error font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-ink-muted">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
