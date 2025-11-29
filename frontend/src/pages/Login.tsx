import { auth } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleLogin = () => {
    auth.initiateOAuth();
  };

  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: '#fafafa'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        border: '1px solid #e0e0e0',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          marginBottom: '8px',
          color: '#1a1a1a'
        }}>
          DynoForm
        </h1>
        <p style={{ 
          color: '#666', 
          marginBottom: '32px',
          fontSize: '14px'
        }}>
          Connect with Airtable to create dynamic forms
        </p>
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '12px',
            background: '#1a1a1a',
            color: 'white',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Connect Airtable
        </button>
      </div>
    </div>
  );
}
