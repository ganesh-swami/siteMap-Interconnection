"use client"

import { useEffect, useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios, { endpoints } from 'src/utils/axios';
import { UserContext } from './context';

const initialState = {
  currentUser: null,
  userPlan:null,
  users:null,
  loading: false,
  error: false,
  message: null,
};

const reducer = (state, action) => {
  if (action.type === 'initial') {
    return {
      ...state,
      currentUser: null,
      userPlan:null,
      users:null,
      loading: false,
      error: false,
      message: null,
    };
  }
  if (action.type === 'getUser') {
    return {
      ...state,
      currentUser: action.payload.user,
      userPlan:action.payload.plan || null,
      loading: false,
      error: false,
      message: null,
    };
  }
  if (action.type === 'updateCurrentUser') {
    return {
      ...state,
      currentUser: action.payload,
      loading: false,
      error: false,
      message: null,
    };
  }
  if (action.type === 'changePassword') {
    return {
      ...state,
      loading: false,
      error: action.payload.error,
      message: action.payload.message,
    };
  }
  // if (action.type === 'createUser') {
  //   return {
  //     ...state,
  //     message: null,
  //     error: false,
  //     loading: true,
  //     UserMapId: action.payload.id,
  //   };
  // }

  if (action.type === 'getUsers') {
    return {
      ...state,
      message: action.payload.message,
      error: action.payload.error,
      loading: false,
      users: action.payload.users,
    };
  }

  return state;
};

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    dispatch({
      type: 'initial',
      payload: {},
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getUser = useCallback(async () => {
    const callingURL = `${endpoints.user.me}`;
    // debugger;
    const response = await axios.get(callingURL);

    const { user,error,plan } = response.data;

    if (error) {
      throw new Error(error);
    } else {
      dispatch({
        type: 'getUser',
        payload: {
          user,
          plan
        },
      });
    }
  }, []);

  const changePassword = useCallback(async (oldPassword,newPassword) => {

    const data = {
      oldPassword,
      newPassword
    };
    const callingURL = `${endpoints.user.me}`;
    // debugger;
    const response = await axios.patch(callingURL,data);

    const { user,error } = response.data;

    if (error) {
      
      dispatch({
        type: 'changePassword',
        payload: {
          error:true,
          message:error
        },
      });
      throw new Error(error);
    } else {
      dispatch({
        type: 'changePassword',
        payload: {
          message:'Password Updated Successfully.',
          error:false
        },
      });
    }
  }, []);

  const updateCurrentUser = useCallback(async (name) => {
    const data={
      name
    }
    const callingURL = `${endpoints.user.me}`;
    // debugger;
    const response = await axios.patch(callingURL,data);

    const { user,error } = response.data;

    if (error) {
      
      dispatch({
        type: 'updateCurrentUser',
        payload: {
          error:true,
          message:error
        },
      });
      throw new Error(error);
    } else {
      dispatch({
        type: 'updateCurrentUser',
        payload: {
          message:'Profile Updated Successfully.',
          error:false,
          currentUser:user
        },
      });
    }
  }, []);



  const getUsers = useCallback(async (page,search,orderby) => {
    
    const callingURL = `${endpoints.user.me}?page=${page}&orderby=${orderby}&search=${search}`;
    // debugger;
    const response = await axios.get(callingURL);

    const { users,error } = response.data;

    if (error) {
      dispatch({
        type: 'getUsers',
        payload: {
          error:true,
          message:error,
          users:[],
        },
      });
      throw new Error(error);
    } else {
      dispatch({
        type: 'getUsers',
        payload: {
          error:false,
          users,
          message:null,
        },
      });
    }
  }, []);

  // const createUser = useCallback(async (url) => {
  //   const data = {
  //     url,
  //   };

  //   // console.log('start....');
  //   dispatch({ type: 'calling' });
  //   const response = await axios.post(endpoints.User.UserMap, data);

  //   // console.log('ooooooooooooo');
  //   const { id, success, error } = response.data;

  //   console.log('response.data', response.data);
  //   if (error) {
  //     // console.log('throughing error ...');
  //     throw new Error(error);
  //   } else {
  //     // setSession(accessToken);
  //     // const user = decode(accessToken);
  //     dispatch({
  //       type: 'createUser',
  //       payload: {
  //         id,
  //       },
  //     });
  //   }
  // }, []);

  const memoizedValue = useMemo(
    () => ({
      currentUser:state.currentUser,
      users:state.users,
      loading:state.loading,
      error:state.error,
      message:state.message,
      userPlan:state.userPlan,
      getUser,
      updateCurrentUser,
      changePassword,
      getUsers
    }),
    [
      state.currentUser,
      state.users,
      state.loading,
      state.error,
      state.message,
      state.userPlan,
      getUser,
      updateCurrentUser,
      changePassword,
      getUsers
    ]
  );

  return <UserContext.Provider value={memoizedValue}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node,
};
