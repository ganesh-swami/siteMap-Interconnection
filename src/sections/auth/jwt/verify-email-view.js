'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// import { useGoogleLogin } from '@react-oauth/google';
// import GoogleLogin from 'react-google-login';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
// import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button'
// import IconButton from '@mui/material/IconButton';
// import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
// import InputAdornment from '@mui/material/InputAdornment';
// routes

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
// import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
// import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';




// ----------------------------------------------------------------------

export default function EmailVerifyView() {
  const { sendEmailVerify,emailVerify, message} = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const [successMsg,setSuccessMsg]=useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');
  const verifyToken = searchParams.get('token');

  useEffect(()=>{

    (async () => {
      if(verifyToken){
        console.log('verifyToken',verifyToken)
        try {
          await emailVerify(verifyToken);
        } catch (error) {
          setErrorMsg(typeof error === 'string' ? error : error.message);
        }
      }
    })();
  },[verifyToken])

  useEffect(()=>{
    if(message){
      setSuccessMsg(message);
    }
  },[message])



  const password = useBoolean();

  const EmailSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(EmailSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await sendEmailVerify?.(data.email);
      setSuccessMsg('Mail has been sent to verify your email.') 
      setErrorMsg(''); 
    } catch (error) {
      // reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });


  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      
        <Typography variant="h3">Request For Login Steps</Typography>
        {!!errorMsg && 
      <Alert severity="error">{errorMsg}</Alert>}

      {!!successMsg && <Alert severity="success">{successMsg}</Alert>}
      
        <Stack direction="row" justifyContent="center" alignItems="center"spacing={0.5}>
          <Typography className="new-user-text" variant="body2">Already have verified emailID ?</Typography>

          <Link component={RouterLink} href={paths.auth.jwt.login} variant="subtitle2">
            login here
          </Link>
        </Stack>
      </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>

      
      
      <RHFTextField name="email" label="Email address" />

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Send Email Verification Mail?
      </Link> */}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Email
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {!verifyToken && renderForm}
    </FormProvider>
  );
}
