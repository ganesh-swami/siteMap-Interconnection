import PropTypes from 'prop-types';
// _mock
import { _userList } from 'src/_mock/_user';
// sections
import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User Edit',
};

export default function UserEditPage({ params }) {
  const { id } = params;

  return <UserEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

UserEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
