import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------
// console.log('HOST_API',HOST_API)
const axiosInstance = axios.create({ baseURL: HOST_API });

// console.log('axiosInstance:',axiosInstance.defaults.baseURL);


axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

const ROOT_PATH=process.env.NEXT_PUBLIC_ENVIRONMENT==='DEV' ?'/dev':''

export const endpoints = {
  auth: {
    login: `${ROOT_PATH}/api/auth/login/`,
    register: `${ROOT_PATH}/api/auth/register/`,
    googleLogin: `${ROOT_PATH}/api/auth/googleLogin/`,
    sendEmailVerify: `${ROOT_PATH}/api/auth/sendEmailVerify/`,
    forgotPassword: `${ROOT_PATH}/api/auth/forgotPassword/`,
    changePassword: `${ROOT_PATH}/api/auth/changePassword/`,
  },
  user: {
    me: `${ROOT_PATH}/api/users/me/`,
  },
  payment: {
    createIntent: `${ROOT_PATH}/api/payment/create-intent/`,
  },
  topical: {
    topicalMap: `${ROOT_PATH}/api/service/topical/`,
    topicalHistory: `${ROOT_PATH}/api/service/topical/history/`,
  },
  // chat: `${ROOT_PATH}/api/chat`,
  // kanban: `${ROOT_PATH}/api/kanban`,
  // calendar: `${ROOT_PATH}/api/calendar`,
};
