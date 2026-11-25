import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { FailedAttemptsAlert } from '../components/FailedAttemptsAlert';
import { RoleDemoSwitcher } from '../components/RoleDemoSwitcher';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';

export const LoginPage = () => {
  const {
    login,
    switchRole,
    user,
    failedAttemptsCount,
    isLocked,
    lockoutUntil,
    resetFailedAttempts,
  } = useAuth();

  const [loginError, setLoginError] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleLoginSubmit = (credentials) => {
    setLoginError('');
    const res = login(credentials);
    if (!res.success) {
      setLoginError(res.error);
    }
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    if (recoveryEmail.trim()) {
      setRecoverySent(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Cabecera Institucional */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-primary text-white shadow-subtle mb-1">
            <span className="font-display font-black text-2xl tracking-tighter text-secondary">SN</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink-base tracking-tight">
            STOCK<span className="text-secondary">.NET</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Gestión Integral de Inventarios, Punto de Venta y Cadena de Suministro
          </p>
        </div>

        {/* Tarjeta de Autenticación */}
        <div className="bg-surface-lowest border border-borderline rounded-xl p-6 sm:p-8 shadow-subtle space-y-5">
          <div className="border-b border-borderline/60 pb-3">
            <h2 className="font-display font-bold text-base text-ink-base">
              Acceso a la Plataforma
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Ingrese sus credenciales registradas para ingresar al sistema
            </p>
          </div>

          {/* Alertas de intentos y fallos */}
          <FailedAttemptsAlert
            attemptsCount={failedAttemptsCount}
            isLocked={isLocked}
            onReset={resetFailedAttempts}
          />

          {loginError && !isLocked && (
            <div className="p-3 bg-status-error-bg border border-status-error-border rounded-sm text-xs text-status-error font-medium">
              {loginError}
            </div>
          )}

          {/* Formulario */}
          <LoginForm onSubmit={handleLoginSubmit} isLoading={false} />

          {/* Recuperación de contraseña */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setShowRecoveryModal(true);
                setRecoverySent(false);
                setRecoveryEmail('');
              }}
              className="text-xs text-ink-muted hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              ¿Olvidó sus credenciales de acceso?
            </button>
          </div>
        </div>

        {/* Simulador rápido de roles */}
        <RoleDemoSwitcher onSelectRole={switchRole} currentRole={user?.role} />

        {/* Footer legal */}
        <div className="text-center text-[11px] text-ink-muted">
          STOCK.NET v2.0 &bull; Estándar IEEE 830 &bull; Arquitectura Feature-First
        </div>
      </div>

      {/* Modal de Recuperación */}
      <Modal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        title="Recuperación de Credenciales"
        subtitle="Restablecimiento seguro para operadores del sistema"
        maxWidth="max-w-md"
      >
        {recoverySent ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-status-success-bg rounded-full flex items-center justify-center mx-auto text-status-success">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-display font-semibold text-sm text-ink-base">
              Instrucciones Enviadas
            </h4>
            <p className="text-xs text-ink-muted max-w-xs mx-auto">
              Se ha remitido un enlace temporal de validación a <strong>{recoveryEmail}</strong> para
              restablecer su clave de acceso.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRecoveryModal(false)}
              className="mt-2"
            >
              Cerrar Ventana
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRecoverySubmit} className="space-y-4 py-2">
            <p className="text-xs text-ink-muted leading-relaxed">
              Ingrese el correo institucional asociado a su cuenta. El administrador de sistemas
              validará la solicitud de recuperación.
            </p>
            <input
              type="email"
              required
              placeholder="su.correo@stocknet.com"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="w-full bg-surface-lowest text-ink-base text-sm border border-borderline rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowRecoveryModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="secondary" size="sm">
                Enviar Solicitud
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
