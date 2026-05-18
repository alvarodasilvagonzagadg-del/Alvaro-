import React, { createContext, useContext, ReactNode } from 'react';
import { useFlixEarn } from '../hooks/useFlixEarn';

type FlixEarnContextType = ReturnType<typeof useFlixEarn>;

const FlixEarnContext = createContext<FlixEarnContextType | undefined>(undefined);

export function FlixEarnProvider({ children }: { children: ReactNode }) {
  const flixEarn = useFlixEarn();
  return (
    <FlixEarnContext.Provider value={flixEarn}>
      {children}
    </FlixEarnContext.Provider>
  );
}

export function useFlixEarnContext() {
  const context = useContext(FlixEarnContext);
  if (!context) throw new Error('useFlixEarnContext must be used within a FlixEarnProvider');
  return context;
}
