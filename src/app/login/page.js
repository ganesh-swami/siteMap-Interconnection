// sections
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Login - Topical',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
