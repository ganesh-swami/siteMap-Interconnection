'use client';

import PropTypes from 'prop-types';
// auth
import { AuthGuard,GuestGuard } from 'src/auth/guard';
// components
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      {/* <GuestGuard> */}
      <DashboardLayout>{children}</DashboardLayout>
      {/* </GuestGuard> */}
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
