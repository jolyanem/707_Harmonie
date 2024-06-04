import { Link } from '@tanstack/react-router';
import { useAuth } from '~/components/auth';
import { Button } from '~/components/ui/button';

const IndexPage = () => {
  const auth = useAuth();

  return (
    <div>
      <div>
        {auth.state}
        <br />
        {auth.user ? 'User: ' + auth.user.email : ''}
        <br />
        {auth.user?.role ? 'Role: ' + auth.user.role : ''}
      </div>
      {auth.state === 'authenticated' ? (
        <div>
          <Button
            onClick={() => {
              auth.logout();
            }}
            variant="destructive"
          >
            Se déconnecter
          </Button>
        </div>
      ) : (
        <div>
          <Button asChild>
            <Link to="/auth/login">Se connecter</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
