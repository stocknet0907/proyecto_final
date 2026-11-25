import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/cn';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No hay registros',
  description = 'No se han encontrado elementos disponibles para mostrar con los filtros aplicados.',
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-surface-lowest border border-dashed border-borderline rounded-lg',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary mb-3">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h4 className="font-display font-semibold text-base text-ink-base mb-1">{title}</h4>
      <p className="text-xs text-ink-muted max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
