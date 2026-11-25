export const ROLES = {
  ADMIN: 'admin',
  DB_ADMIN: 'db_admin',
  CASHIER: 'cashier',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrador Propietario',
  [ROLES.DB_ADMIN]: 'Administrador BD / Almacén',
  [ROLES.CASHIER]: 'Empleado / Cajero',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canViewDashboard: true,
    canManageProducts: true,
    canManageCategories: true,
    canOperatePos: true,
    canViewSales: true,
    canManagePurchases: true,
    canManageSuppliers: true,
    canManageCustomers: true,
    canManageCredits: true,
    canManageUsers: true,
    canAdjustStock: true,
    canViewFinancials: true,
  },
  [ROLES.DB_ADMIN]: {
    canViewDashboard: true,
    canManageProducts: true,
    canManageCategories: true,
    canOperatePos: false,
    canViewSales: false,
    canManagePurchases: true,
    canManageSuppliers: true,
    canManageCustomers: true,
    canManageCredits: false,
    canManageUsers: false,
    canAdjustStock: true,
    canViewFinancials: false,
  },
  [ROLES.CASHIER]: {
    canViewDashboard: false,
    canManageProducts: false,
    canManageCategories: false,
    canOperatePos: true,
    canViewSales: false,
    canManagePurchases: false,
    canManageSuppliers: false,
    canManageCustomers: true,
    canManageCredits: true,
    canManageUsers: false,
    canAdjustStock: false,
    canViewFinancials: false,
  },
};
