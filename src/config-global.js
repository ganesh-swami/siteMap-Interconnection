// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------
let host_api = process.env.NEXT_PUBLIC_HOST_LOCAL_API;
let assets_api = process.env.NEXT_PUBLIC_ASSETS_LOCAL_API;
if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'DEV') {
  host_api = process.env.NEXT_PUBLIC_HOST_DEV_API;
  assets_api = process.env.NEXT_PUBLIC_ASSETS_DEV_API;
}
else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'LIVE') {
  host_api = process.env.NEXT_PUBLIC_HOST_lIVE_API;
  assets_api = process.env.NEXT_PUBLIC_ASSETS_lIVE_API;
}
export const HOST_API = host_api;
export const ASSETS_API = assets_api;
export const GOOGLE_SINGIN_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const FIREBASE_API = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: process.env.NEXT_PUBLIC_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
};

export const MAPBOX_API = process.env.NEXT_PUBLIC_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
