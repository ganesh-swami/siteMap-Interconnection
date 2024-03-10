'use client';

import { useContext } from 'react';
//
import { UserContext } from './context';

// ----------------------------------------------------------------------

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error('useUserContext context must be use inside UserProvider');

  return context;
};
