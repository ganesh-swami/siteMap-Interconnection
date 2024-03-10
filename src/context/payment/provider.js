import { useEffect, useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
// import axios, { endpoints } from 'src/utils/axios';
import { PaymentContext } from './context';

const initialState = {
  activePlan: null,
  loading: false,
  error: false,
  message: null,
};

const reducer = (state, action) => {
  if (action.type === 'initial') {
    return initialState;
  }
  if (action.type === 'activePlan') {
    return {
      ...state,
      activePlan: action.payload.plan,
      loading: true,
      error: false,
      message: null,
    };
  }
  

  return state;
};

export function PaymentProvider({ children }) {
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

  

  // const getActivePlan = useCallback(async () => {
  //   const callingURL = `${endpoints.plan.topicalMap}?topicalId=${topicalId}`;
  //   // debugger;
  //   const response = await axios.get(callingURL);

  //   // console.log('ooooooooooooo');
  //   const { success, topicalMap, error } = response.data;

  //   // console.log('response.data', response.data);
  //   if (error) {
  //     // console.log('throughing error ...');
  //     throw new Error(error);
  //   } else {
  //     dispatch({
  //       type: 'getTopicalMap',
  //       payload: {
  //         topicalMap,
  //         shouldAddToMaps
  //       },
  //     });
  //   }
  // }, []);


  const memoizedValue = useMemo(
    () => ({
      activePlan: state.activePlan,
      loading: state.loading,
      error: state.error,
      message: state.message,
    }),
    [
      state.activePlan,
      state.error,
      state.message,
      state.loading,
    ]
  );
  

  return <PaymentContext.Provider value={memoizedValue}>{children}</PaymentContext.Provider>;
}

PaymentProvider.propTypes = {
  children: PropTypes.node,
};
