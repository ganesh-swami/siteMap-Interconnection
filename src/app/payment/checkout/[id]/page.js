// sections
import PropTypes from 'prop-types';
import CheckoutForm from 'src/sections/payment/checkoutForm';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'checkout - Topical',
};

export default function CheckoutPage({params}) {
  const {id} = params;
  console.log('planid ... ',id);
  return <CheckoutForm planId={id}/>;
}

CheckoutPage.propTypes = {
  params: PropTypes.object,
};
