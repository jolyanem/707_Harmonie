import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '~/components/auth';

const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.login().then(() => {
      navigate({
        to: '/',
      });
    });
  }, [auth, navigate]);

  return <></>;
};

export default CallbackPage;
