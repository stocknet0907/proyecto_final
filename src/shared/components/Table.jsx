import React from 'react';
import { cn } from '../utils/cn';

export const Table = ({
  columns = [],
  data = [],
  keyExtractor = (item) => item.id,
  emptyMessage = 'No se encontraron registros',
  className,
  onRowClick,
}) => {
  return (
    <div className={cn('w-full overflow-x-auto border border-borderline rounded-lg bg-surface-lowest', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-primary text-white border-b border-borderline text-xs font-semibold uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={cn(
                  'py-3 px-4 font-display font-medium text-white',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-borderline/70 text-sm">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-ink-muted text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={keyExtractor(item, rowIndex)}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  'transition-colors duration-100',
                  rowIndex % 2 === 0 ? 'bg-surface-lowest' : 'bg-surface-low/50',
                  onRowClick ? 'cursor-pointer hover:bg-primary-light/60' : 'hover:bg-surface-container/50'
                )}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key || colIndex}
                    className={cn(
                      'py-3 px-4 text-ink-base',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                      col.className
                    )}
                  >
                    {col.render ? col.render(item, rowIndex) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
