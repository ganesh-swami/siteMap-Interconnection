// sections
import { AccountView } from 'src/sections/account/view';
import { UserProvider, UserConsumer } from 'src/context/user';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Account Settings',
};

export default function AccountPage() {
  

  return (
  // <UserProvider>
  //   <UserConsumer>
      <AccountView />
  //   </UserConsumer>
  // </UserProvider>
  );
}
