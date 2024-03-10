import { _id, _postTitles } from 'src/_mock/assets';
// ----------------------------------------------------------------------

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
const rootPath = environment === 'DEV' ? '/dev' : '';



// ----------------------------------------------------------------------

// const MOCK_ID = _id[1];

const ROOTS = {
  AUTH: `${rootPath}`,
  DASHBOARD: `${rootPath}/dashboard`,
  PAYMENT: `${rootPath}/payment`,
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  // payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login/`,
      register: `${ROOTS.AUTH}/register/`,
      verifyEmail: `${ROOTS.AUTH}/email-verify/`,
      forgotPassword: `${ROOTS.AUTH}/forgot-password/`,
    },
  },
  topical:{
    topicalMap:`${ROOTS.DASHBOARD}/topical/`,
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/`,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user/`,
      new: `${ROOTS.DASHBOARD}/user/new/`,
      list: `${ROOTS.DASHBOARD}/user/list/`,
      cards: `${ROOTS.DASHBOARD}/user/cards/`,
      profile: `${ROOTS.DASHBOARD}/user/profile/`,
      account: `${ROOTS.DASHBOARD}/user/account/`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit/`,
      // demo: {
      //   edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit/`,
      // },
    },
  },
  payment: {
    checkout: `${ROOTS.PAYMENT}/checkout/`,
    success: `${ROOTS.PAYMENT}/success/`,
  },
};
