import React from 'react';
import { DollarSign, TrendingUp, Layers, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../../shared/utils/formatters';

export const MarginAnalysisCard = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 shadow-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-primary-light flex items-center justify-center text-primary">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-ink-muted block">Ventas Brutas</span>
          <span className="font-display font-bold text-base sm:text-lg text-ink-base font-mono">
            {formatCurrency(metrics.grossSales)}
          </span>
        </div>
      </div>

      <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 shadow-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-surface-container flex items-center justify-center text-ink-muted">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-ink-muted block">Costo de Ventas (COGS)</span>
          <span className="font-display font-bold text-base sm:text-lg text-ink-muted font-mono">
            {formatCurrency(metrics.totalCOGS)}
          </span>
        </div>
      </div>

      <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 shadow-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-status-success-bg flex items-center justify-center text-status-success">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-ink-muted block">Utilidad Bruta Neta</span>
          <span className="font-display font-bold text-base sm:text-lg text-status-success font-mono">
            {formatCurrency(metrics.netProfit)}
          </span>
        </div>
      </div>

      <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 shadow-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-secondary-light flex items-center justify-center text-secondary-dark">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs text-ink-muted block">Margen Promedio Real</span>
          <span className="font-display font-bold text-base sm:text-lg text-secondary-dark font-mono">
            {formatPercent(metrics.avgMarginPercent)}
          </span>
        </div>
      </div>
    </div>
  );
};
