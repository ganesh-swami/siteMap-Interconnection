'use client';

import PropTypes from 'prop-types';
// components
import { SplashScreen } from 'src/components/loading-screen';
//
import { PaymentContext } from './context';

export function PaymentConsumer({ children }) {
  return (
    <PaymentContext.Consumer>
      {(contextState) => (contextState.loading ? children : children)}
    </PaymentContext.Consumer>
  );
}

PaymentConsumer.propTypes = {
  children: PropTypes.node,
};
