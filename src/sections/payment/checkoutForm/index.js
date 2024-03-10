'use client'

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import axios, { endpoints } from 'src/utils/axios';
import constant from 'src/utils/const'
import { paths } from 'src/routes/paths';
import CheckoutForm from "./checkoutForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout({planId}) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = React.useState(null);
  const [plan,setPlan]=React.useState(null);
  const [planAmount,setPlanAmount]=React.useState(null);
  const [error,setError]=React.useState(null);
  const [isTrial,setIsTrial]=React.useState(false);
  // const [planId,setPlanId]=useState('652a8250ef8565228c6d4d8b')
  // const planId='653225bca2fd3a078a4d1123';
  
  React.useEffect(() => {
    console.log('planid',planId)
    if(!planId){
      setError(constant.DEFAULT_ERROR);
    }
    else{
    // Create PaymentIntent as soon as the page loads
      axios.post(endpoints.payment.createIntent,{ planId })
        .then((res) => {
          console.log('data',res.data);
          if(res?.data?.isTrial){
            // router.push(paths.payment.success);
            setIsTrial(true)
          }
          else{
            setError(null);
            setPlan(res.data.plan)
            setPlanAmount(res.data.amount)
            setClientSecret(res.data.clientSecret)
          }
          
        }
        ).catch((err)=>{
          let errmsg = constant.DEFAULT_ERROR;
          if(err?.message){
            errmsg = err.message;
          } 
          if(err.error){
            errmsg=err.error;
          }
          setError(errmsg);
          console.log('err1 ',err);
        })
    }
  }, [planId]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="checkoutForm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        {/* //spacing={2} */}
        <Grid xs={6} md={8}  item> 
        {!error && clientSecret &&
            <>
            <Stack my={2}>
              <Typography variant="h2" component="h2">Plan : {plan}</Typography>
              <Typography variant="h3" component="h3">Amount : {planAmount}$</Typography>
            </Stack>
          
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm clientSecret={clientSecret} plan={plan} planAmount={planAmount}/>
            </Elements>
            </>
        }
        {!error && !clientSecret && !isTrial && <CircularProgress color="secondary" /> }
        {error &&
          <Alert severity="error">
              <Typography variant="body2">
                {error}
              </Typography>
          </Alert>
        }
        {isTrial && 
          <Stack my={2}>
              <Alert sx={{my:3}} severity="success">
                  <Typography variant="h5" component="h5">Free trial is started successfully. Trial will end in {constant.TRIAL_PERIOD_DAYS} days</Typography>
              </Alert>
          </Stack>
        }
        </Grid>
        
      </Box>
    </div>
  );
}
Checkout.propTypes = {
  planId: PropTypes.string,
};
