'use client';

// @mui
// import { alpha } from '@mui/material/styles';
import { useState,useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress'
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// components
import { useSettingsContext } from 'src/components/settings';
import { useTopicalContext } from 'src/context/topical/use-topical-context';
import FormProvider from 'src/components/hook-form';
import TopicalHistory from 'src/components/topical-history';
import styles from './styles';


// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();

  const [TopicalMapData, setTopicalMapData] = useState({});

  const {
    topicalMapId,
    topicalData,
    loading,
    getTopicalMapCallTimes,
    error,
    message,
    createTopicalMap,
    getTopicalMap,
    // getTopicalHistory,
    // topicalMaps,
    // topicalMapsPage
  } = useTopicalContext();

  console.log('error , message',error , message);

  const TopicalSchema = Yup.object().shape({
    url: Yup.string().required('Please enter blog URL'),
  });

  const defaultValues = {
    url: '',
  };

  const methods = useForm({
    resolver: yupResolver(TopicalSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    console.log('topicalMapId----------', topicalMapId);
    if (topicalMapId) {
      // startCalling to get topicalmap
      getTopicalMap(topicalMapId);
    }
  }, [topicalMapId]);



  useEffect(() => {
    setTimeout(
      () => {
        console.log('........................', topicalData);
        console.log('topicalData?.status', topicalData?.status);
        // console.log('!error', !error);
        // console.log('getTopicalMapCallTimes < 10', getTopicalMapCallTimes < 10);
        if (
          topicalData &&
          topicalData?.status === 'PROCESSING' &&
          !error &&
          getTopicalMapCallTimes < 5
        ) {
          console.log('calling......');

          getTopicalMap(topicalMapId);
        }
      },
      3000 + getTopicalMapCallTimes * 500
    );
  }, [getTopicalMapCallTimes]);

  useEffect(() => {
    if (topicalData) {
      // alert('res');
      console.log('getTopicalMapCallTimes', getTopicalMapCallTimes);
      console.log('TopicalMapData', topicalData);

      setTopicalMapData(topicalData);
    }
  }, [topicalData]);


  const onSubmit = handleSubmit((data) => {
    // console.log('=================== handle submit')
    // setLoading(true);
    createTopicalMap(data.url);
  });

  

  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Topical Map </Typography>
        {/* <Typography style={{fontWeight:600,}} pb={0.5} variant="h5"> Topical </Typography> */}
        <styles.FormWrapper
        >
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              <styles.TopicalInputBox
                name="url"
                fullWidth
                autoFocus
                placeholder="Enter URI To Make Topical Map"
                label="Blog Url"
                type="url"
                color='secondary'
                size='small'
              />
              
              <Box sx={{ display: 'flex',justifyContent:'right' }}>
                <LoadingButton
                  color="secondary"
                  size="small"
                  type="submit"
                  variant="contained"
                  loading={loading}
                  sx={{
                    padding:'0.3775rem 1rem',
                    height:'32px',
                    borderRadius:'6px',
                  }}
                  // onClick={}
                >
                  View Topical Map
                </LoadingButton>
              </Box>
              {!!error && message && <Alert severity="error">{message}</Alert>}
            </Stack>
          </FormProvider>
        </styles.FormWrapper>

        { !loading && TopicalMapData && TopicalMapData.status === 'PROCESSING' && 
        
          <LinearProgress sx={{
            my:4
          }} /> 
              
        }
          
         <TopicalHistory /> 
        
    </Container>
  );
}
