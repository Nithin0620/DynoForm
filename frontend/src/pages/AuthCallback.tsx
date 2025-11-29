import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      login(code, state)
        .then(() => {
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Auth failed:', error);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [login, navigate]);

  return <LoadingSpinner message="Authenticating..." />;
}
