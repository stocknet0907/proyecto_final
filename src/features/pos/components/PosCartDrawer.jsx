import React from 'react';
import { Trash2, Plus, Minus, UserCheck, ShoppingBag, Percent } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { formatCurrency } from '../../../shared/utils/formatters';

export const PosCartDrawer = ({
  cartItems = [],
  totals,
  selectedCustomer,
  discountPercent,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenCustomerSelect,
  onSetDiscount,
  onProceedCheckout,
}) => {
  return (
    <div className="bg-surface-lowest border border-borderline rounded-lg flex flex-col h-full shadow-subtle overflow-hidden">
      {/* Encabezado del Carrito & Cliente */}
      <div className="p-3.5 border-b border-borderline bg-surface-container/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-sm text-ink-base">
            Orden de Venta ({totals.totalItems})
          </h3>
        </div>
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-[11px] text-status-error hover:underline font-medium"
          >
            Vaciar Carrito
          </button>
        )}
      </div>

      {/* Selector de Cliente */}
      <div className="px-3.5 py-2.5 border-b border-borderline bg-surface-container/20 flex items-center justify-between text-xs">
        <div className="truncate pr-2">
          <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-semibold">
            Cliente Asignado:
          </span>
          <span className="font-semibold text-ink-base truncate block">
            {selectedCustomer ? selectedCustomer.name : 'Cliente de Mostrador (Contado)'}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenCustomerSelect} className="text-xs shrink-0">
          <UserCheck className="w-3.5 h-3.5 mr-1" />
          {selectedCustomer ? 'Cambiar' : 'Asignar'}
        </Button>
      </div>

      {/* Lista de Artículos */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-borderline/50">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-ink-muted">
            <ShoppingBag className="w-8 h-8 stroke-[1.5] text-borderline mb-2" />
            <p className="text-xs font-semibold">El carrito está vacío</p>
            <p className="text-[10px] max-w-xs mt-0.5">
              Haga clic en los productos o escanee su código para iniciar la orden
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.productId} className="pt-2 flex items-center justify-between gap-2 text-xs">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-base truncate leading-tight">{item.productName}</p>
                <div className="flex items-center gap-2 mt-0.5 text-ink-muted font-mono">
                  <span>{formatCurrency(item.unitPrice)}</span>
                  <span>&bull;</span>
                  <span className="text-primary font-semibold">{formatCurrency(item.subtotal)}</span>
                </div>
              </div>

              {/* Controles de Cantidad */}
              <div className="flex items-center gap-1 bg-surface-container rounded-sm border border-borderline p-0.5">
                <button
                  type="button"
                  onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                  className="w-5 h-5 flex items-center justify-center text-ink-base hover:bg-surface-lowest rounded-sm transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-mono font-bold text-xs">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center text-ink-base hover:bg-surface-lowest rounded-sm transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemoveItem(item.productId)}
                className="text-ink-muted hover:text-status-error p-1 transition-colors"
                title="Eliminar ítem"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Descuentos y Liquidación de Totales (RF10) */}
      <div className="p-3.5 border-t border-borderline bg-surface-container/30 space-y-2">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>Subtotal:</span>
          <span className="font-mono tabular-nums font-medium text-ink-base">
            {formatCurrency(totals.subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-muted">
          <div className="flex items-center gap-1.5">
            <span>Descuento:</span>
            <select
              value={discountPercent}
              onChange={(e) => onSetDiscount(Number(e.target.value))}
              className="bg-surface-lowest border border-borderline rounded text-[11px] px-1 py-0.5 focus:outline-none"
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
            </select>
          </div>
          <span className="font-mono tabular-nums text-status-success font-medium">
            -{formatCurrency(totals.discountAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>IVA Liquidado (19%):</span>
          <span className="font-mono tabular-nums font-medium text-ink-base">
            {formatCurrency(totals.tax)}
          </span>
        </div>

        <div className="pt-2 border-t border-borderline flex items-center justify-between">
          <span className="font-display font-bold text-sm text-ink-base">TOTAL A COBRAR:</span>
          <span className="font-display font-black text-xl text-primary font-mono tabular-nums">
            {formatCurrency(totals.total)}
          </span>
        </div>

        <Button
          variant="secondary"
          size="lg"
          className="w-full mt-2 font-black shadow-md text-ink-base tracking-wide"
          disabled={cartItems.length === 0}
          onClick={onProceedCheckout}
        >
          Cobrar Orden &bull; {formatCurrency(totals.total)}
        </Button>
      </div>
    </div>
  );
};
