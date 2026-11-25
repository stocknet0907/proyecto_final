import React, { useState } from 'react';
import { Search, Download, TrendingUp } from 'lucide-react';
import { useSales } from '../hooks/useSales';
import { SalesTable } from '../components/SalesTable';
import { SaleDetailModal } from '../components/SaleDetailModal';
import { MarginAnalysisCard } from '../components/MarginAnalysisCard';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { useToast } from '../../../shared/components/Toast';

export const SalesPage = () => {
  const {
    sales,
    searchTerm,
    setSearchTerm,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedStatus,
    setSelectedStatus,
    financialMetrics,
    cancelSale,
  } = useSales();

  const { addToast } = useToast();

  const [selectedSale, setSelectedSale] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [saleToCancel, setSaleToCancel] = useState(null);

  const handleOpenDetail = (sale) => {
    setSelectedSale(sale);
    setIsDetailOpen(true);
  };

  const handleConfirmCancel = () => {
    if (saleToCancel) {
      cancelSale(saleToCancel.id);
      addToast({ message: `Venta ${saleToCancel.id} anulada formalmente.`, type: 'info' });
      setSaleToCancel(null);
    }
  };

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base">
            Gestión de Ventas & Análisis de Márgenes
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Auditoría de facturación, rentabilidad por comprobante y desglose de costo de mercancía
          </p>
        </div>
        <Button variant="outline" onClick={handleExportReport} icon={Download}>
          Exportar Reporte
        </Button>
      </div>

      {/* KPI Cards de Márgenes (RF16, RF41, RF44) */}
      <MarginAnalysisCard metrics={financialMetrics} />

      {/* Filtros */}
      <div className="bg-surface-lowest border border-borderline rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 shadow-subtle">
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por N° Factura, Nombre de Cliente o Documento..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            <option value="all">Todos los Medios</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="credit">Crédito</option>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Anuladas</option>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <SalesTable
        sales={sales}
        onViewDetail={handleOpenDetail}
        onCancelSale={(sale) => setSaleToCancel(sale)}
      />

      {/* Modales */}
      <SaleDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        sale={selectedSale}
      />

      <ConfirmDialog
        isOpen={!!saleToCancel}
        onClose={() => setSaleToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="¿Anular este comprobante de venta?"
        message={`Está a punto de anular la factura ${saleToCancel?.id}. Esta acción marcará la transacción como cancelada en el historial contable.`}
        confirmText="Confirmar Anulación"
        variant="danger"
      />
    </div>
  );
};
