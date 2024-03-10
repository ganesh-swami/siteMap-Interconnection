import { useEffect, useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios, { endpoints } from 'src/utils/axios';
import { TopicalContext } from './context';

const initialState = {
  topicalMapId: null,
  topicalData: null,
  allTopicalMaps:[],
  loading: false,
  error: false,
  message: null,
  getTopicalMapCallTimes: 0,
  topicalMapsPage:0,
};

const reducer = (state, action) => {
  if (action.type === 'initial') {
    return {
      topicalMapId: null,
      topicalData: null,
      allTopicalMaps:[],
      loading: false,
      error: false,
      message: null,
      getTopicalMapCallTimes: 0,
    };
  }
  if (action.type === 'error') {
    return {
      ...state,
      loading: false,
      error: true,
      message: action.payload.error,
      getTopicalMapCallTimes:5,
    };
  }
  if (action.type === 'calling') {
    return {
      ...state,
      topicalMapId: null,
      topicalData: null,
      loading: true,
      error: false,
      message: null,
      getTopicalMapCallTimes: 0,
    };
  }
  if (action.type === 'createTopical') {
    return {
      ...state,
      message: null,
      error: false,
      loading: true,
      topicalMapId: action.payload.id,
    };
  }

  if (action.type === 'getTopicalMap') {
    // console.log('state', state, action.payload.topicalMap);
    console.log('state.allTopicalMaps', state.allTopicalMaps);
    
    const TopicalMaps=state.allTopicalMaps || [];
    // console.log('TopicalMaps', TopicalMaps);
    if(action.payload.shouldAddToMaps===true && action.payload.topicalMap && action.payload.topicalMap.status==='COMPLETED'){
      // debugger;
      const topicalMap= {
        _id:action.payload.topicalMap._id,
        origin:action.payload.topicalMap.origin,
        url:action.payload.topicalMap.url, 
        userId:action.payload.topicalMap.userId,
        title:action.payload.topicalMap.title,
        createdAt:action.payload.topicalMap.createdAt,
         
      }
      
      TopicalMaps.unshift(topicalMap)
      console.log('TopicalMaps after',TopicalMaps)
    }


    return {
      ...state,
      message: null,
      error: false,
      loading: false,
      topicalData: action.payload.topicalMap,
      getTopicalMapCallTimes: state.getTopicalMapCallTimes ? state.getTopicalMapCallTimes + 1 : 1,
      allTopicalMaps:TopicalMaps
    };
  }

  if (action.type === 'getTopicalMaps') {
    // console.log('state================== ',  action.payload.topicalMaps);
    console.log('----------------------- ',  [...state.allTopicalMaps,...action.payload.topicalMaps]);
    return {
      ...state,
      message: null,
      error: false,
      allTopicalMaps: [...state.allTopicalMaps,...action.payload.topicalMaps],
      topicalMapsPage:state.topicalMapsPage+1,
    };

  }

  return state;
};

export function TopicalProvider({ children }) {
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

  // LOGIN
  const createTopicalMap = useCallback(async (url) => {
    const data = {
      url,
    };

    try{
    // console.log('start....');
    dispatch({ type: 'calling' });
    const response = await axios.post(endpoints.topical.topicalMap, data);

    // console.log('ooooooooooooo');
    const { id, success, error } = response.data;

    console.log('response.data', response.data);
    if (error) {
      // console.log('throughing error ...');
      dispatch({
        type:'error',
        payload:{
          error
        }
      })
      throw new Error(error);
    } else {
      // setSession(accessToken);
      // const user = decode(accessToken);
      dispatch({
        type: 'createTopical',
        payload: {
          id,
        },
      });
    }
  }
  catch(e){
    console.log('e.message',e)
    dispatch({
      type:'error',
      payload:{
        error:e.error || e.message
      }
    })
  }
  }, []);

  const getTopicalMap = useCallback(async (topicalId,shouldAddToMaps=true) => {
    console.log('start....topicalId', topicalId);
    const callingURL = `${endpoints.topical.topicalMap}?topicalId=${topicalId}`;
    // debugger;
    const response = await axios.get(callingURL);

    // console.log('ooooooooooooo');
    const { success, topicalMap, error } = response.data;

    // console.log('response.data', response.data);
    if (error) {
      // console.log('throughing error ...');
      throw new Error(error);
    } else {
      dispatch({
        type: 'getTopicalMap',
        payload: {
          topicalMap,
          shouldAddToMaps
        },
      });
    }
  }, []);

  const getTopicalHistory = useCallback(async () => {
    console.log('@getTopicalHistory....page', state.topicalMapsPage );
    const callingURL = `${endpoints.topical.topicalHistory}?page=${state.topicalMapsPage+1}`;
    const response = await axios.get(callingURL);

    // console.log('ooooooooooooo');
    const { success, topicalMaps, error } = response.data;

    // console.log('response.data', response.data);
    if (error) {
      // console.log('throughing error ...');
      throw new Error(error);
    } else {
      dispatch({
        type: 'getTopicalMaps',
        payload: {
          topicalMaps,
        },
      });
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      topicalData: state.topicalData,
      getTopicalMapCallTimes: state.getTopicalMapCallTimes,
      topicalMapId: state.topicalMapId,
      loading: state.loading,
      error: state.error,
      message: state.message,
      topicalMapsPage:state.topicalMapsPage,
      topicalMaps:state.allTopicalMaps,
      createTopicalMap,
      getTopicalMap,
      getTopicalHistory
    }),
    [
      createTopicalMap,
      getTopicalMap,
      getTopicalHistory,
      state.topicalData,
      state.getTopicalMapCallTimes,
      state.topicalMapId,
      state.error,
      state.message,
      state.loading,
      state.topicalMapsPage,
      state.allTopicalMaps
    ]
  );
  

  return <TopicalContext.Provider value={memoizedValue}>{children}</TopicalContext.Provider>;
}

TopicalProvider.propTypes = {
  children: PropTypes.node,
};
