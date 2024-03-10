'use client';

import { useContext } from 'react';
//
import { TopicalContext } from './context';

// ----------------------------------------------------------------------

export const useTopicalContext = () => {
  const context = useContext(TopicalContext);

  if (!context) throw new Error('useTopicalContext context must be use inside TopicalProvider');

  return context;
};
