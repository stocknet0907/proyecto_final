import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

export const LoginForm = ({ onSubmit, isLoading }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'El usuario o correo institucional es obligatorio';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ usernameOrEmail, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Usuario o Correo Institucional"
        placeholder="ejemplo@stocknet.com"
        icon={Mail}
        value={usernameOrEmail}
        onChange={(e) => setUsernameOrEmail(e.target.value)}
        error={errors.usernameOrEmail}
        required
        autoComplete="username"
      />

      <Input
        label="Contraseña de Acceso"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        icon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword(!showPassword)}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
        autoComplete="current-password"
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="w-full font-bold shadow-md text-ink-base"
          disabled={isLoading}
          icon={LogIn}
        >
          {isLoading ? 'Autenticando...' : 'Iniciar Sesión en STOCK.NET'}
        </Button>
      </div>
    </form>
  );
};
