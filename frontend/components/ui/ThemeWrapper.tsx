'use client';

import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface ThemeWrapperProps {
  children: ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { theme } = useAuth();

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
}