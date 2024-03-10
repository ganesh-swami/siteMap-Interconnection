'use client';

import PropTypes from 'prop-types';
// components
import { SplashScreen } from 'src/components/loading-screen';
//
import { UserContext } from './context';

export function UserConsumer({ children }) {
  return (
    <UserContext.Consumer>
      {(contextState) => (contextState.loading ? children : children)}
    </UserContext.Consumer>
  );
}

UserConsumer.propTypes = {
  children: PropTypes.node,
};
