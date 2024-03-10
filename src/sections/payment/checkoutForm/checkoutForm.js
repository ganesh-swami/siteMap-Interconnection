'use client';

import React from 'react';
import {
  PaymentElement,
  // LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert } from '@mui/material';
import { paths } from 'src/routes/paths';

let hostUrl = process.env.NEXT_PUBLIC_HOST_LOCAL_URL;
if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'DEV') {
  hostUrl = process.env.NEXT_PUBLIC_HOST_DEV_URL;
}
else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'LIVE') {
  hostUrl = process.env.NEXT_PUBLIC_HOST_LIVE_URL;
}

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  // const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [severity, setSeverity] = React.useState('error');

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log('paymentIntent.status', paymentIntent.status);
      switch (paymentIntent.status) {
        case 'requires_source':
          break;
        case 'succeeded':
          setSeverity('success');
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setSeverity('warning');
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setSeverity('error');
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setSeverity('error');
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    
    // console.log('=============== ',hostUrl + paths.payment.success);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: hostUrl + paths.payment.success,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setEmail(e.target.value)}
      /> */}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        // type="submit"
        variant="contained"
        loading={isLoading}
        type="submit"
        disabled={isLoading || !stripe || !elements}
        id="submit"
        sx={{
          my: 2,
        }}
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner" /> : 'Pay now'}
        </span>
      </LoadingButton>
      {/* Show any error or success messages */}
      {message && (
        <Alert severity={severity} id="payment-message">
          {message}
        </Alert>
      )}
    </form>
  );
}

CheckoutForm.propTypes = {
  clientSecret: PropTypes.string,
};
