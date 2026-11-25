import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const FailedAttemptsAlert = ({ attemptsCount, isLocked, remainingSecs, onReset }) => {
  if (attemptsCount === 0 && !isLocked) return null;

  return (
    <div
      className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 transition-all ${
        isLocked
          ? 'bg-status-error-bg border-status-error text-status-error'
          : 'bg-status-warning-bg border-status-warning text-status-warning'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isLocked ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-bold text-ink-base">
          {isLocked ? 'Alerta de Seguridad: Acceso Bloqueado' : 'Advertencia de Intentos Fallidos'}
        </p>
        <p className="leading-relaxed">
          {isLocked
            ? `Se han registrado múltiples intentos erróneos. Por política de seguridad institucional, la cuenta se encuentra suspendida por ${
                remainingSecs || 60
              } segundos.`
            : `Ha realizado ${attemptsCount} intento(s) fallido(s). Al alcanzar 3 intentos, el acceso será bloqueado temporalmente.`}
        </p>
        {isLocked && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] underline font-semibold text-primary hover:text-primary-dark pt-1 block"
          >
            [Modo Demo] Desbloquear manualmente ahora
          </button>
        )}
      </div>
    </div>
  );
};
