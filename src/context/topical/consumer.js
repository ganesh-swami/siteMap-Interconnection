'use client';

import PropTypes from 'prop-types';
// components
import { SplashScreen } from 'src/components/loading-screen';
//
import { TopicalContext } from './context';

export function TopicalConsumer({ children }) {
  return (
    <TopicalContext.Consumer>
      {(contextState) => (contextState.loading ? children : children)}
    </TopicalContext.Consumer>
  );
}

TopicalConsumer.propTypes = {
  children: PropTypes.node,
};
