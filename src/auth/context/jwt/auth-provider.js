'use client';

import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
import decode from 'jwt-decode';
// utils
import axiosInstance, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
  error: false,
  message: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
      error: false,
      message: null,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
      error: action.payload.error,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  if (action.type === 'SUCCESSMESSAGE') {
    return {
      ...state,
      message: action.payload.message,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY); // set a breakpoint at this line
      // console.log('@auth-provider accessToken', accessToken); // set a breakpoint at this line
      // debugger;
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken); // set a breakpoint at this line

        // console.log('@auth axiosInstance:',axiosInstance.defaults.baseURL);
        const response = await axiosInstance.get(endpoints.user.me);

        const { user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        }); // set a breakpoint at this line
      }
      // console.log('@auth-provider 2 '); // set a breakpoint at this line
    } catch (error) {
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    console.log('start....');
    const response = await axiosInstance.post(endpoints.auth.login, data);

    console.log('ooooooooooooo');
    const { accessToken, error } = response.data;

    console.log('response.data', response.data);
    if (error) {
      console.log('throughing error ...');
      throw new Error(error);
    } else {
      setSession(accessToken);
      const user = decode(accessToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    }
  }, []);

  // LOGIN
  const loginWithGoogle = useCallback(async (authCode) => {
    const data = {
      authCode,
    };

    const response = await axiosInstance.post(endpoints.auth.googleLogin, data);

    const { accessToken, error } = response.data;
    if (error) {
      throw new Error(error);
    } else {
      setSession(accessToken);
      const user = decode(accessToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    }
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, name) => {
    const data = {
      email,
      password,
      name,
    };

    const response = await axiosInstance.post(endpoints.auth.register, data);

    const { message, error } = response.data;
    // const { accessToken } = response.data;

    // sessionStorage.setItem(STORAGE_KEY, accessToken);
    // const user = decode(accessToken)
    if (error) {
      throw new Error(error);
    } else {
      dispatch({
        type: 'REGISTER',
        payload: {
          message,
        },
      });
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // VERIFICATION MAIL

  const sendEmailVerify = useCallback(async (email) => {
    const data = {
      email,
    };

    const response = await axiosInstance.post(endpoints.auth.sendEmailVerify, data);

    const { message, error } = response.data;
    if (error) {
      throw new Error(error);
    } else {
      dispatch({
        type: 'SUCCESSMESSAGE',
        payload: {
          message,
        },
      });
    }
  }, []);

  const emailVerify = useCallback(async (verifyToken) => {
    const data = {
      verifyToken,
    };

    const response = await axiosInstance.post(endpoints.auth.sendEmailVerify, data);

    const { message, error } = response.data;
    if (error) {
      throw new Error(error);
    } else {
      dispatch({
        type: 'SUCCESSMESSAGE',
        payload: {
          message,
        },
      });
    }
  }, []);

  const sendForgotPwdMail = useCallback(async (email) => {
    const data = {
      email,
    };

    const response = await axiosInstance.post(endpoints.auth.forgotPassword, data);

    const { message, error } = response.data;
    if (error) {
      throw new Error(error);
    } else {
      dispatch({
        type: 'SUCCESSMESSAGE',
        payload: {
          message,
        },
      });
    }
  }, []);

  const changePassword = useCallback(async (token, newPassword) => {
    const data = {
      token,
      newPassword,
    };

    const response = await axiosInstance.post(endpoints.auth.changePassword, data);

    const { message, error } = response.data;
    if (error) {
      throw new Error(error);
    } else {
      dispatch({
        type: 'SUCCESSMESSAGE',
        payload: {
          message,
        },
      });
    }
  }, []);
  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      error: state.error,
      message: state.message,
      //
      login,
      register,
      logout,
      loginWithGoogle,
      emailVerify,
      sendEmailVerify,
      sendForgotPwdMail,
      changePassword,
    }),
    [
      login,
      logout,
      register,
      loginWithGoogle,
      sendEmailVerify,
      emailVerify,
      sendForgotPwdMail,
      changePassword,
      state.user,
      state.error,
      state.message,
      status,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
