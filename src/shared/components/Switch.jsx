import React from 'react';
import { cn } from '../utils/cn';

export const Switch = ({ checked, onChange, disabled, label, size = 'md', className }) => {
  const isSm = size === 'sm';

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={cn(
            'bg-borderline peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/40 rounded-full transition-colors',
            'peer-checked:bg-status-success',
            isSm ? 'w-8 h-4.5' : 'w-11 h-6'
          )}
        />
        <div
          className={cn(
            'absolute bg-white rounded-full transition-transform border border-borderline shadow-sm',
            isSm
              ? 'top-[2px] left-[2px] w-3.5 h-3.5 peer-checked:translate-x-3.5'
              : 'top-[2px] left-[2px] w-5 h-5 peer-checked:translate-x-5'
          )}
        />
      </div>
      {label && (
        <span className={cn('text-sm font-medium', checked ? 'text-ink-base' : 'text-ink-muted')}>
          {label}
        </span>
      )}
    </label>
  );
};
