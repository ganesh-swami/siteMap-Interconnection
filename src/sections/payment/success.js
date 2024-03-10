'use client'

import React,{useState,useEffect} from "react";
import { Alert, Box , Grid, Stack, Typography,Link } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
// import {useStripe} from "@stripe/react-stripe-js";
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';



export default function SuccessView() {
    // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    // const [plan,setPlan]=React.useState(null);
    // const [planAmount,setPlanAmount]=React.useState(null);
    const [message, setMessage] = useState(null);
    const [severity,setSeverity]= useState(null);
  
    const searchParams = useSearchParams();
    const payment_intent = searchParams.get('payment_intent');
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');
    


   useEffect(() => {
    (async () => {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
          return;
        }
    
        stripe.retrievePaymentIntent(payment_intent_client_secret).then(({ paymentIntent }) => {
          console.log('paymentIntent',paymentIntent);
          console.log('paymentIntent.status',paymentIntent.status)
          switch (paymentIntent.status) {
            case "requires_source":
              break;
            case "succeeded":
              setSeverity('success');
              setMessage("Payment successfully Received.");
              break;
            case "processing":
              setSeverity('warning');
              setMessage("Your payment is in processing.");
              break;
            case "requires_payment_method":
              setSeverity('error');
              setMessage("Your payment was not successful, please try again.");
              break;
            default:
              setSeverity('error');
              setMessage("Something went wrong.");
              break;
          }
        });
    })();
  }, [payment_intent_client_secret]);



    return(
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
        >
            <Grid item xs={6} md={8} >
            {severity &&
            <Stack my={2}>
                <Alert sx={{my:3}} severity={severity}>
                    <Typography variant="h5" component="h5">{message}</Typography>
                </Alert>
                <Typography  variant="p" component="p">Transaction ID : {payment_intent} </Typography>
                {severity==='success' && <Stack direction="row" justifyContent="center" alignItems="center"spacing={0.5}>
                    <span className="new-text">Create Topical Map? </span>
                    <Link component={RouterLink} href={paths.dashboard.root} variant="subtitle2">
                        Dashboard
                    </Link>
                    </Stack>
                }
            </Stack>
}
            </Grid>
        </Box>
    )

}