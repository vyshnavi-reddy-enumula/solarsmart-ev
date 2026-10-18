import React, { createContext, useContext, useState, useEffect } from 'react';
import { DemoRole } from '../types/navigation';

interface RoleContextType {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  toggleRole: () => void;
  isOperator: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'solarsmart-demo-role-preference';

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<DemoRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY) as DemoRole | null;
      if (saved === 'user' || saved === 'operator') {
        return saved;
      }
    }
    return 'user';
  });

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  }, [role]);

  const setRole = (newRole: DemoRole) => {
    setRoleState(newRole);
  };

  const toggleRole = () => {
    setRoleState((prev) => (prev === 'user' ? 'operator' : 'user'));
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        isOperator: role === 'operator',
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
