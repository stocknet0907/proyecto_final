import React, { useState } from 'react';
import { Search, CreditCard, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { useCredits } from '../hooks/useCredits';
import { CreditTable } from '../components/CreditTable';
import { CreditPaymentModal } from '../components/CreditPaymentModal';
import { CreditStatementModal } from '../components/CreditStatementModal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { useToast } from '../../../shared/components/Toast';
import { formatCurrency } from '../../../shared/utils/formatters';

export const CreditsPage = () => {
  const {
    credits,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    portfolioStats,
    registerPayment,
  } = useCredits();

  const { addToast } = useToast();

  const [selectedCreditForPay, setSelectedCreditForPay] = useState(null);
  const [selectedCreditForStatement, setSelectedCreditForStatement] = useState(null);

  const handleConfirmPayment = (paymentData) => {
    const res = registerPayment(paymentData);
    if (res.success) {
      if (res.isPaidInFull) {
        addToast({
          message: '¡Crédito saldado en su totalidad! Cupo liberado al cliente.',
          type: 'success',
        });
      } else {
        addToast({
          message: `Abono de ${formatCurrency(paymentData.amount)} aplicado correctamente.`,
          type: 'success',
        });
      }
    }
    return res;
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base">
            Gestión de Créditos & Control de Cartera
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Monitoreo de cuentas por cobrar, registro de abonos y liquidación de deudas
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          Exportar Cartera
        </Button>
      </div>

      {/* KPI Cards de Cartera (RF28) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-warning-bg flex items-center justify-center text-status-warning">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Cartera Vigente (Al Día)</span>
            <span className="font-display font-bold text-lg text-status-warning font-mono">
              {formatCurrency(portfolioStats.totalCurrentDebt)}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-error-bg flex items-center justify-center text-status-error">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Cartera Vencida (En Mora)</span>
            <span className="font-display font-bold text-lg text-status-error font-mono">
              {formatCurrency(portfolioStats.totalOverdueDebt)}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-success-bg flex items-center justify-center text-status-success">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Total Recaudado (Abonos)</span>
            <span className="font-display font-bold text-lg text-status-success font-mono">
              {formatCurrency(portfolioStats.totalRecovered)}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-surface-lowest border border-borderline rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 shadow-subtle">
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por Código Crédito, Factura o Nombre de Cliente..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="current">Vigentes (Al Día)</option>
            <option value="overdue">Vencidos (En Mora)</option>
            <option value="paid">Saldados (Pagados)</option>
          </Select>
        </div>
      </div>

      {/* Tabla de Créditos */}
      <CreditTable
        credits={credits}
        onRegisterPayment={(credit) => setSelectedCreditForPay(credit)}
        onViewStatement={(credit) => setSelectedCreditForStatement(credit)}
      />

      {/* Modales */}
      <CreditPaymentModal
        isOpen={!!selectedCreditForPay}
        onClose={() => setSelectedCreditForPay(null)}
        credit={selectedCreditForPay}
        onConfirmPayment={handleConfirmPayment}
      />

      <CreditStatementModal
        isOpen={!!selectedCreditForStatement}
        onClose={() => setSelectedCreditForStatement(null)}
        credit={selectedCreditForStatement}
      />
    </div>
  );
};
