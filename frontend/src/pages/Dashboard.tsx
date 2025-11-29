import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormsStore } from '../store/formsStore';
import { useAuthStore } from '../store/authStore';
import NavBar from '../components/NavBar';
import FormCard from '../components/FormCard';

export default function Dashboard() {
  const { forms, fetchForms, loading } = useFormsStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <NavBar userName={user?.name} onLogout={handleLogout} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>
            Your Forms
          </h2>
          <Link
            to="/forms/create"
            style={{
              padding: '10px 20px',
              background: '#1a1a1a',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            Create Form
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#666', fontSize: '14px' }}>Loading forms...</p>
        ) : forms.length === 0 ? (
          <div style={{
            padding: '48px',
            border: '1px solid #e0e0e0',
            background: 'white',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
              No forms yet
            </p>
            <Link
              to="/forms/create"
              style={{
                padding: '10px 20px',
                background: '#1a1a1a',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {forms.map((form) => (
              <FormCard key={form._id} form={form} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
