import React from 'react';
import { DollarSign, TrendingUp, AlertTriangle, CreditCard, Truck, Package } from 'lucide-react';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { KpiCard } from '../components/KpiCard';
import { SalesMarginChart } from '../components/SalesMarginChart';
import { StockAlertsList } from '../components/StockAlertsList';
import { QuickActions } from '../components/QuickActions';
import { Card } from '../../../shared/components/Card';
import { formatCurrency, formatDate, formatPercent } from '../../../shared/utils/formatters';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const metrics = useDashboardMetrics();

  return (
    <div className="space-y-6">
      {/* Cabecera del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base tracking-tight">
            Panel de Control Ejecutivo & Almacén
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Monitoreo en tiempo real de transacciones, rentabilidad bruta, existencias y cartera
          </p>
        </div>
        <div className="text-xs font-mono text-ink-muted bg-surface-lowest px-3 py-1.5 rounded-sm border border-borderline">
          Última sincronización: Hoy {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Grid de KPIs Principales (RF44) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Ventas Totales Brutas"
          value={formatCurrency(metrics.grossSales)}
          subtext="Facturación acumulada en sistema"
          icon={DollarSign}
          variant="primary"
          trend={{ value: '+12.5%', isPositive: true }}
        />

        <KpiCard
          title="Utilidad Neta Real"
          value={formatCurrency(metrics.netProfit)}
          subtext={`Margen comercial: ${formatPercent(metrics.avgMarginPercent)}`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: '+8.2%', isPositive: true }}
        />

        <KpiCard
          title="Stock Bajo o Crítico"
          value={`${metrics.criticalStockCount} ítems`}
          subtext={`${metrics.outOfStockCount} productos agotados (0)`}
          icon={AlertTriangle}
          variant={metrics.criticalStockCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          title="Cuentas por Cobrar (Cartera)"
          value={formatCurrency(metrics.totalReceivable)}
          subtext={`En mora: ${formatCurrency(metrics.overdueReceivable)}`}
          icon={CreditCard}
          variant={metrics.overdueReceivable > 0 ? 'error' : 'secondary'}
        />
      </div>

      {/* Accesos Directos Operativos */}
      <QuickActions />

      {/* Sección Analítica: Gráfico de Rendimiento & Alertas de Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesMarginChart />
        </div>
        <div className="lg:col-span-1">
          <StockAlertsList products={metrics.criticalProductsList} />
        </div>
      </div>

      {/* Tabla de Operaciones Recientes (RF46) */}
      <Card
        title="Últimas Transacciones Registradas en Caja"
        subtitle="Auditoría de ventas directas y asignaciones nominales"
        headerAction={
          <Link
            to="/sales"
            className="text-xs font-semibold text-primary hover:text-primary-dark"
          >
            Ver Historial Completo
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-primary text-white font-medium">
                <th className="py-2.5 px-3">Comprobante</th>
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Medio de Pago</th>
                <th className="py-2.5 px-3 text-right">Total Facturado</th>
                <th className="py-2.5 px-3 text-right">Margen Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline">
              {metrics.recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-surface-container/40">
                  <td className="py-2.5 px-3 font-mono font-semibold text-primary">
                    {sale.id}
                  </td>
                  <td className="py-2.5 px-3 text-ink-muted">{formatDate(sale.date, true)}</td>
                  <td className="py-2.5 px-3 font-medium text-ink-base">{sale.customerName}</td>
                  <td className="py-2.5 px-3 uppercase font-mono text-[11px] text-ink-muted">
                    {sale.paymentMethod}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-base">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-status-success">
                    {formatCurrency(sale.netMargin)} ({formatPercent(sale.marginPercent)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
