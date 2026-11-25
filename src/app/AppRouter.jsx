import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Layout } from '../shared/components/Layout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ProductsPage } from '../features/inventory/pages/ProductsPage';
import { CategoriesPage } from '../features/inventory/pages/CategoriesPage';
import { PosPage } from '../features/pos/pages/PosPage';
import { SalesPage } from '../features/sales/pages/SalesPage';
import { PurchasesPage } from '../features/purchases/pages/PurchasesPage';
import { SuppliersPage } from '../features/suppliers/pages/SuppliersPage';
import { CustomersPage } from '../features/customers/pages/CustomersPage';
import { CreditsPage } from '../features/credits/pages/CreditsPage';
import { UsersPage } from '../features/users/pages/UsersPage';
import { NotFoundPage } from '../features/notFound/pages/NotFoundPage';
import { ROLES } from '../shared/constants/roles';

// Guard de Ruta Protegida
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && user?.permissions && !user.permissions[requiredPermission]) {
    // Si no tiene permiso (ej. cajero entrando a finanzas o usuarios), redirige a POS
    return <Navigate to="/pos" replace />;
  }

  return children;
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta Pública: Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Protegidas bajo Layout común */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredPermission="canViewDashboard">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Inventario */}
        <Route
          path="inventory/products"
          element={
            <ProtectedRoute requiredPermission="canManageProducts">
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="inventory/categories"
          element={
            <ProtectedRoute requiredPermission="canManageCategories">
              <CategoriesPage />
            </ProtectedRoute>
          }
        />

        {/* Punto de Venta (POS) */}
        <Route
          path="pos"
          element={
            <ProtectedRoute requiredPermission="canOperatePos">
              <PosPage />
            </ProtectedRoute>
          }
        />

        {/* Ventas y Rentabilidad */}
        <Route
          path="sales"
          element={
            <ProtectedRoute requiredPermission="canViewSales">
              <SalesPage />
            </ProtectedRoute>
          }
        />

        {/* Compras y Recepción */}
        <Route
          path="purchases"
          element={
            <ProtectedRoute requiredPermission="canManagePurchases">
              <PurchasesPage />
            </ProtectedRoute>
          }
        />

        {/* Proveedores */}
        <Route
          path="suppliers"
          element={
            <ProtectedRoute requiredPermission="canManageSuppliers">
              <SuppliersPage />
            </ProtectedRoute>
          }
        />

        {/* Clientes */}
        <Route
          path="customers"
          element={
            <ProtectedRoute requiredPermission="canManageCustomers">
              <CustomersPage />
            </ProtectedRoute>
          }
        />

        {/* Créditos y Cartera */}
        <Route
          path="credits"
          element={
            <ProtectedRoute requiredPermission="canManageCredits">
              <CreditsPage />
            </ProtectedRoute>
          }
        />

        {/* Usuarios y Roles */}
        <Route
          path="users"
          element={
            <ProtectedRoute requiredPermission="canManageUsers">
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
