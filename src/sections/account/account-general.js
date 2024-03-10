import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect,useState } from 'react'; // useCallback
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import {Box,Avatar} from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LinearProgress from '@mui/material/LinearProgress';
// import Typography from '@mui/material/Typography';
// hooks
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
// import { fData } from 'src/utils/format-number';
// // assets
// import { countries } from 'src/assets/data';
// // components
// import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  // RHFSwitch,
  RHFTextField,
  // RHFUploadAvatar,
  // RHFAutocomplete,
} from 'src/components/hook-form';

import {useUserContext} from 'src/context/user/use-user-context'


// ----------------------------------------------------------------------

export default function AccountGeneral({currentUser}) {
  const { enqueueSnackbar } = useSnackbar();

  const [user,setUser] = useState(null);

  const {
    loading,
    updateCurrentUser,
    error,
    message
  } = useUserContext();

  // useEffect(()=>{
  //   if(currentUser){
  //     setUser(currentUser)
  //   }
  // },[currentUser])
  
  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // photoURL: Yup.mixed().nullable().required('Avatar is required'),
    // phoneNumber: Yup.string().required('Phone number is required'),
    // country: Yup.string().required('Country is required'),
    // address: Yup.string().required('Address is required'),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    // zipCode: Yup.string().required('Zip code is required'),
    // about: Yup.string().required('About is required'),
    // // not required
    // isPublic: Yup.boolean(),
  });

  const defaultValues = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    // photoURL: user?.photoURL || null,
    // phoneNumber: user?.phoneNumber || '',
    // country: user?.country || '',
    // address: user?.address || '',
    // state: user?.state || '',
    // city: user?.city || '',
    // zipCode: user?.zipCode || '',
    // about: user?.about || '',
    // isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await updateCurrentUser(data.name);
      // enqueueSnackbar('Update success!');
      // console.info('DATA', data);
    } catch (err) {
      console.error(err);
    }
  });

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0];

  //     const newFile = Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //     });

  //     if (file) {
  //       setValue('photoURL', newFile, { shouldValidate: true });
  //     }
  //   },
  //   [setValue]
  // );

  

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {currentUser ?
          <>
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
              


          <Avatar
            alt='User Profile'
            sx={{
              width: 100,
              height: 100,
              mx:'auto',
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
              
            }}
          />

              {/* <Button variant="soft" color="error" sx={{ mt: 3 }}>
                Delete User
              </Button> */}
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="email" disabled label="Email Address" />
                {/* <RHFTextField name="phoneNumber" label="Phone Number" />
                <RHFTextField name="address" label="Address" /> */}

                {/* <RHFAutocomplete
                  name="country"
                  label="Country"
                  options={countries.map((country) => country.label)}
                  getOptionLabel={(option) => option}
                  renderOption={(props, option) => {
                    const { code, label, phone } = countries.filter(
                      (country) => country.label === option
                    )[0];

                    if (!label) {
                      return null;
                    }

                    return (
                      <li {...props} key={label}>
                        <Iconify
                          key={label}
                          icon={`circle-flags:${code.toLowerCase()}`}
                          width={28}
                          sx={{ mr: 1 }}
                        />
                        {label} ({code}) +{phone}
                      </li>
                    );
                  }}
                /> */}

                {/* <RHFTextField name="state" label="State/Region" />
                <RHFTextField name="city" label="City" />
                <RHFTextField name="zipCode" label="Zip/Code" /> */}
              </Box>

              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

                <LoadingButton type="submit" variant="contained" color="secondary" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
          </>
        : 
          <Box width='100%'><LinearProgress color="secondary" /></Box>
        }
      </Grid>
    </FormProvider>
  );
}

AccountGeneral.propTypes = {
  currentUser: PropTypes.object || undefined,
};
