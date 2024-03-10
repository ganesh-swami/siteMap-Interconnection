'use client';

// @mui
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

// components
// import ReactFlow, { Background, Panel } from 'reactflow';
import { useSettingsContext } from 'src/components/settings';
import { useTopicalContext } from 'src/context/topical/use-topical-context';
import TopicalMap from 'src/components/topical-map/topical-map';

// ----------------------------------------------------------------------

import styles from './styles'

import 'reactflow/dist/style.css';

// import defaultNodes from './nodes.js';
// import defaultEdges from './edges.js';

export default function TopicalView(props) {
  const {id} = props;
  const settings = useSettingsContext();
  const {
    topicalData,
    error,
    message,
    getTopicalMap,
  } = useTopicalContext();
  console.log('useTopicalContext() : ',useTopicalContext())
  const [TopicalMapData, setTopicalMapData] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    console.log('topicalMapId----------', id);
    if (id) {
      // startCalling to get topicalmap
      setLoading(true);
      getTopicalMap(id,false);
    }
  }, [id]);

  useEffect(() => {
    if (topicalData) {
      console.log('TopicalMapData', topicalData);
      setLoading(false);
      setTopicalMapData(topicalData);
    }
  }, [topicalData]);


  return (
    <styles.TopicalContainer themeStretch={settings.themeStretch}>
        <Typography style={{fontWeight:600,textAlign:'center',p:3}}  variant="h2"> Topical Map</Typography>
        <div>
        {TopicalMapData && TopicalMapData.topicalMap && TopicalMapData.status === 'COMPLETED' &&
              <TopicalMap topicaldata={JSON.parse(TopicalMapData.topicalMap)} />
        }
        {loading && 
          <Box
          mt={5}
          style={{
            "display": "flex",
            "justifyContent": "center",
            
          }}>
          <CircularProgress />
          </Box>
        }
      </div>
      </styles.TopicalContainer>
  );
}

TopicalView.propTypes = {
  id: PropTypes.string,
};