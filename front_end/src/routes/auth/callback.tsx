import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useAuth } from '~/components/auth';

const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setTimeout(() => {
        flushSync(() => {
          auth.setAuth(token);
        });
        navigate({
          to: '/projects',
        });
      }, 10);
    }
  }, []);

  return <div>AuthCallback</div>;
};

export default AuthCallback;
