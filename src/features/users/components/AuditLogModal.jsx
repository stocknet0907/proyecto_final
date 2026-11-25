import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { Badge } from '../../../shared/components/Badge';
import { formatDate } from '../../../shared/utils/formatters';
import { History, Shield } from 'lucide-react';

export const AuditLogModal = ({ isOpen, onClose, auditLogs = [] }) => {
  const getSeverityBadge = (sev) => {
    const map = {
      info: { label: 'Informativo', variant: 'primary' },
      success: { label: 'Éxito', variant: 'success' },
      warning: { label: 'Atención', variant: 'warning' },
      error: { label: 'Crítico', variant: 'error' },
    };
    const s = map[sev] || { label: sev, variant: 'neutral' };
    return <Badge variant={s.variant} size="xs">{s.label}</Badge>;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bitácora de Auditoría & Trazabilidad de Operaciones (RF31)"
      subtitle="Registro inmutable de acciones sensibles ejecutadas en el sistema"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="border border-borderline rounded-lg overflow-hidden max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-primary text-white font-medium sticky top-0">
                <th className="py-2 px-3 text-left">Fecha / Hora</th>
                <th className="py-2 px-3 text-left">Operador</th>
                <th className="py-2 px-3 text-left">Módulo / Acción</th>
                <th className="py-2 px-3 text-left">Detalle</th>
                <th className="py-2 px-3 text-center">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container/40">
                  <td className="py-2 px-3 font-mono text-[11px] text-ink-muted whitespace-nowrap">
                    {formatDate(log.timestamp, true)}
                  </td>
                  <td className="py-2 px-3 font-semibold text-ink-base whitespace-nowrap">
                    {log.operatorName}
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-semibold text-primary block">{log.action}</span>
                    <span className="text-[10px] text-ink-muted">{log.module}</span>
                  </td>
                  <td className="py-2 px-3 text-ink-muted max-w-xs">{log.details}</td>
                  <td className="py-2 px-3 text-center">{getSeverityBadge(log.severity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar Bitácora
          </Button>
        </div>
      </div>
    </Modal>
  );
};
