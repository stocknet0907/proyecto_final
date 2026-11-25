import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-status-error-bg flex items-center justify-center text-status-error mb-4">
        <AlertCircle className="w-8 h-8 stroke-[1.75]" />
      </div>

      <h1 className="font-display font-black text-4xl sm:text-5xl text-ink-base tracking-tight mb-2">
        404
      </h1>
      <h2 className="font-display font-bold text-lg text-ink-base mb-2">
        Recurso o Vista No Encontrada
      </h2>
      <p className="text-xs sm:text-sm text-ink-muted max-w-md mb-6 leading-relaxed">
        La ruta solicitada no existe en el sistema STOCK.NET o ha sido reubicada bajo la nueva
        arquitectura modular.
      </p>

      <div className="flex gap-3">
        <Link to="/dashboard">
          <Button variant="secondary" size="md" icon={Home}>
            Ir al Panel Principal
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="md" icon={ArrowLeft}>
            Retornar al Login
          </Button>
        </Link>
      </div>
    </div>
  );
};
