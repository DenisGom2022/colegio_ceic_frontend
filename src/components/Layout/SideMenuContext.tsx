import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SideMenuContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(undefined);

export const SideMenuProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SideMenuContext.Provider value={{ 
      collapsed, 
      setCollapsed, 
      mobileMenuOpen, 
      setMobileMenuOpen 
    }}>
      {children}
    </SideMenuContext.Provider>
  );
};

export const useSideMenu = (): SideMenuContextType => {
  const context = useContext(SideMenuContext);
  if (context === undefined) {
    throw new Error('useSideMenu must be used within a SideMenuProvider');
  }
  return context;
};
