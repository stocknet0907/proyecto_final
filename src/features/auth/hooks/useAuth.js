import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../../shared/constants/roles';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    users,
    failedAttemptsCount,
    isLocked,
    lockoutUntil,
    login,
    logout,
    switchRoleDemo,
    resetFailedAttempts,
    resetMockData,
  } = useAuthStore();

  const handleLogin = (credentials) => {
    const result = login(credentials);
    if (result.success) {
      // Redirección inteligente por rol (RF06)
      if (result.user.role === ROLES.CASHIER) {
        navigate('/pos');
      } else {
        navigate('/dashboard');
      }
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = (role) => {
    switchRoleDemo(role);
    if (role === ROLES.CASHIER) {
      navigate('/pos');
    } else {
      navigate('/dashboard');
    }
  };

  const handleFullReset = () => {
    // Limpia todas las llaves de stocknet en localStorage
    localStorage.removeItem('stocknet_auth');
    localStorage.removeItem('stocknet_inventory');
    localStorage.removeItem('stocknet_pos');
    localStorage.removeItem('stocknet_sales');
    localStorage.removeItem('stocknet_purchases');
    localStorage.removeItem('stocknet_suppliers');
    localStorage.removeItem('stocknet_customers');
    localStorage.removeItem('stocknet_credits');
    localStorage.removeItem('stocknet_users');

    resetMockData();
    window.location.reload();
  };

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    users,
    failedAttemptsCount,
    isLocked,
    lockoutUntil,
    login: handleLogin,
    logout: handleLogout,
    switchRole: handleSwitchRole,
    resetFailedAttempts,
    resetMockData: handleFullReset,
  };
};
