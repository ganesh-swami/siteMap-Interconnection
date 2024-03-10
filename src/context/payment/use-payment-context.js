'use client';

import { useContext } from 'react';
//
import { PaymentContext } from './context';

// ----------------------------------------------------------------------

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);

  if (!context) throw new Error('usePaymentContext context must be use inside PaymentProvider');

  return context;
};
