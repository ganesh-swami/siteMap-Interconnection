'use client';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

import PropTypes from 'prop-types';
// theme
import { GoogleOAuthProvider } from '@react-oauth/google';
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
// components
import ProgressBar from 'src/components/progress-bar';
import MotionLazy from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
// auth
import { AuthProvider, AuthConsumer } from 'src/auth/context/jwt';

import { GOOGLE_SINGIN_CLIENT_ID } from 'src/config-global';
// ----------------------------------------------------------------------

import { metadata } from 'src/utils/site-metadata';

import '../styles.css';

// export const metadata = {
//   title: 'Topical Map',
//   description:
//     'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
//   keywords: 'react,material,kit,application,dashboard,admin,template',
//   themeColor: '#000000',
//   manifest: '/manifest.json',
//   icons: [
//     {
//       rel: 'icon',
//       url: '/favicon/favicon.ico',
//     },
//     {
//       rel: 'icon',
//       type: 'image/png',
//       sizes: '16x16',
//       url: '/favicon/favicon-16x16.png',
//     },
//     {
//       rel: 'icon',
//       type: 'image/png',
//       sizes: '32x32',
//       url: '/favicon/favicon-32x32.png',
//     },
//     {
//       rel: 'apple-touch-icon',
//       sizes: '180x180',
//       url: '/favicon/apple-touch-icon.png',
//     },
//   ],
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <AuthProvider>
          <GoogleOAuthProvider clientId={GOOGLE_SINGIN_CLIENT_ID}>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light', // 'light' | 'dark'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SettingsDrawer />
                  <ProgressBar />
                  <AuthConsumer>{children}</AuthConsumer>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
};
