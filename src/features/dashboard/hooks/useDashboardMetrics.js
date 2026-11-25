import { useMemo } from 'react';
import { useSalesStore } from '../../sales/store/salesStore';
import { useInventoryStore } from '../../inventory/store/inventoryStore';
import { useCreditsStore } from '../../credits/store/creditsStore';
import { usePurchasesStore } from '../../purchases/store/purchasesStore';

export const useDashboardMetrics = () => {
  const { sales } = useSalesStore();
  const { products } = useInventoryStore();
  const { credits } = useCreditsStore();
  const { orders } = usePurchasesStore();

  const metrics = useMemo(() => {
    const completedSales = sales.filter((s) => s.status === 'completed');

    // 1. Métricas Financieras
    const grossSales = completedSales.reduce((acc, s) => acc + s.total, 0);
    const subtotalBeforeTax = completedSales.reduce((acc, s) => acc + s.subtotal - s.discount, 0);
    const totalCOGS = completedSales.reduce((acc, s) => acc + s.totalCost, 0);
    const netProfit = subtotalBeforeTax - totalCOGS;
    const avgMarginPercent =
      subtotalBeforeTax > 0 ? Number(((netProfit / subtotalBeforeTax) * 100).toFixed(1)) : 0;

    // 2. Alertas de Existencias
    const criticalProducts = products.filter((p) => p.currentStock <= p.minStock);
    const outOfStockProducts = products.filter((p) => p.currentStock === 0);

    // 3. Estado de Cartera / Cuentas por Cobrar
    const totalReceivable = credits
      .filter((c) => c.status !== 'paid')
      .reduce((acc, c) => acc + c.currentBalance, 0);

    const overdueReceivable = credits
      .filter((c) => c.status === 'overdue')
      .reduce((acc, c) => acc + c.currentBalance, 0);

    // 4. Abastecimiento y Compras Pendientes
    const pendingOrdersCount = orders.filter(
      (o) => o.status === 'pending' || o.status === 'partially_received'
    ).length;

    // 5. Histórico reciente de transacciones
    const recentSales = completedSales.slice(0, 5);

    return {
      grossSales,
      netProfit,
      avgMarginPercent,
      criticalStockCount: criticalProducts.length,
      outOfStockCount: outOfStockProducts.length,
      criticalProductsList: criticalProducts.slice(0, 6),
      totalReceivable,
      overdueReceivable,
      pendingOrdersCount,
      recentSales,
      totalProductsCount: products.length,
    };
  }, [sales, products, credits, orders]);

  return metrics;
};
