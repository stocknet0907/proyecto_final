import React from 'react';
import { Card } from '../../../shared/components/Card';
import { formatCurrency } from '../../../shared/utils/formatters';

export const SalesMarginChart = () => {
  // Datos simulados de tendencia semanal representativos
  const weeklyData = [
    { day: 'Lun', sales: 1250000, margin: 440000, height: '45%' },
    { day: 'Mar', sales: 1680000, margin: 610000, height: '60%' },
    { day: 'Mié', sales: 1420000, margin: 510000, height: '52%' },
    { day: 'Jue', sales: 2100000, margin: 790000, height: '78%' },
    { day: 'Vie', sales: 2650000, margin: 980000, height: '95%' },
    { day: 'Sáb', sales: 1980000, margin: 720000, height: '72%' },
    { day: 'Dom', sales: 950000, margin: 340000, height: '35%' },
  ];

  return (
    <Card
      title="Rendimiento Comercial & Margen Semanal (RF45)"
      subtitle="Comparativa de volumen de facturación bruta vs margen de ganancia líquida"
      className="flex flex-col justify-between"
    >
      <div className="flex items-center gap-4 text-xs mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-primary rounded-xs" />
          <span className="text-ink-muted">Venta Bruta Facturada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-secondary rounded-xs" />
          <span className="text-ink-muted">Margen de Ganancia Real</span>
        </div>
      </div>

      {/* Gráfico de Barras SVG / CSS Responsivo */}
      <div className="h-52 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-borderline">
        {weeklyData.map((item) => (
          <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
            <div className="w-full max-w-[2.5rem] flex items-end justify-center gap-1 h-full">
              {/* Barra de Venta */}
              <div
                style={{ height: item.height }}
                className="w-1/2 bg-primary rounded-t-xs transition-all duration-200 group-hover:bg-primary-dark relative"
                title={`Ventas ${item.day}: ${formatCurrency(item.sales)}`}
              />
              {/* Barra de Margen */}
              <div
                style={{ height: `calc(${item.height} * 0.4)` }}
                className="w-1/2 bg-secondary rounded-t-xs transition-all duration-200 group-hover:bg-secondary-hover relative"
                title={`Margen ${item.day}: ${formatCurrency(item.margin)}`}
              />
            </div>
            <span className="text-[11px] font-mono text-ink-muted mt-2 block">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 text-[11px] text-ink-muted">
        <span>Rango: Semana en Curso</span>
        <span className="font-semibold text-status-success font-mono">+14.2% vs semana anterior</span>
      </div>
    </Card>
  );
};
