import PropTypes from 'prop-types';
// @mui
import Grid from '@mui/material/Unstable_Grid2';

//
// import AccountBillingPlan from './account-billing-plan';
// import AccountBillingPayment from './account-billing-payment';
// import AccountBillingHistory from './account-billing-history';
// import AccountBillingAddress from './account-billing-address';

// ----------------------------------------------------------------------

export default function AccountBilling({ cards, plans, invoices, addressBook }) {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        {/* <AccountBillingPlan plans={plans} cardList={cards} addressBook={addressBook} />

        <AccountBillingPayment cards={cards} />

        <AccountBillingAddress addressBook={addressBook} /> */}
      </Grid>

      <Grid xs={12} md={4}>
        {/* <AccountBillingHistory invoices={invoices} /> */}
      </Grid>
    </Grid>
  );
}

AccountBilling.propTypes = {
  addressBook: PropTypes.array,
  cards: PropTypes.array,
  invoices: PropTypes.array,
  plans: PropTypes.array,
};
