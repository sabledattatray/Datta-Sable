'use client';

import { SessionProvider } from "next-auth/react";
import { createContext } from 'react';
export const EbookNavigation = createContext(false);

export function Providers({ children, ebooksEnabled = false }: { children: React.ReactNode; ebooksEnabled?: boolean }) {
  return (
    <SessionProvider>
      <EbookNavigation.Provider value={ebooksEnabled}>{children}</EbookNavigation.Provider>
    </SessionProvider>
  );
}
