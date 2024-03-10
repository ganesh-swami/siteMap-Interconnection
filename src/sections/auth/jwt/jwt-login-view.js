'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGoogleLogin } from '@react-oauth/google';
// import GoogleLogin from 'react-google-login';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login, loginWithGoogle } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  let redirect_uri= 'https://siteMapTopical.com';
  if(process.env.NEXT_PUBLIC_ENVIRONMENT === 'DEV'){
    redirect_uri= 'https://siteMapTopical.com/dev';
  }
  else if(process.env.NEXT_PUBLIC_ENVIRONMENT === 'LOCAL'){
    redirect_uri= 'http://localhost:3001/';
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.log('error.message',error.message,error.error);
      setErrorMsg(typeof error === 'string' ? error : error.message || error.error);
    }
  });

  const googleLogin = useGoogleLogin({
    redirect_uri:process.env.NEXT_PUBLIC_ENVIRONMENT === 'DEV' ? 'https://siteMapTopical.com/dev/':'http://localhost:3001/',
    onSuccess: async ({ code }) => {
      try {
        console.log(code);
        await loginWithGoogle?.(code);

        router.push(returnTo || PATH_AFTER_LOGIN);
      } catch (error) {
        console.error(error);
        // reset();
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    },
    flow: 'auth-code',
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h3">Log in to Topical</Typography>

      <a className="google-login-btn" onClick={() => googleLogin()}>
        <Iconify class="google-logo" icon="flat-color-icons:google" /> Continue with Google
      </a>
      <span className="or-text">or</span>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && (
        <Alert severity="error">
          {errorMsg === 'unVerifiedEmail' ? (
            <Typography variant="body2">
              please verify your email id.
              <Link
                href={paths.auth.jwt.verifyEmail}
                variant="body2"
                color="inherit"
                underline="always"
                sx={{ alignSelf: 'flex-end' }}
              >
                Resend Email Verification
              </Link>{' '}
            </Typography>
          ) : (
            errorMsg
          )}
        </Alert>
      )}

      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Continue with Email
      </LoadingButton>
      <Link class="forgot-pass-link" href={paths.auth.jwt.forgotPassword} variant="body2">
        Forgot your password?
      </Link>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
        <span className="new-text">New to Topical?</span>
        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create account
        </Link>
      </Stack>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 3 }}
      />
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
