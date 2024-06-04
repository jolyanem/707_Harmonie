import { Link } from '@tanstack/react-router';
import { useAuth } from '~/components/auth';
import { Button } from '~/components/ui/button';

const IndexPage = () => {
  const auth = useAuth();

  return (
    <div>
      {auth.state === 'authenticated' ? (
        <div className="relative">
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">
              Bienvenue sur Harmonie,{' '}
              <span className="italic">{auth.user?.name} </span>
              <span className="italic uppercase">{auth.user?.surname}</span> !
            </h1>
          </div>
          <div className="absolute top-0 right-0">
            <Button
              onClick={() => {
                auth.logout();
              }}
              variant="destructive"
            >
              Se déconnecter
            </Button>
          </div>
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
