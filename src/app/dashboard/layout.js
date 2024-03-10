'use client';

import PropTypes from 'prop-types';
// auth
import { AuthGuard } from 'src/auth/guard';
// components
import DashboardLayout from 'src/layouts/dashboard';
import { TopicalProvider, TopicalConsumer } from 'src/context/topical';
// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <TopicalProvider>
        <DashboardLayout>
          <TopicalConsumer>{children}</TopicalConsumer>
        </DashboardLayout>
      </TopicalProvider>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
