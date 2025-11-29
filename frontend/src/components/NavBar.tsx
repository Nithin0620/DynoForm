import { Link } from 'react-router-dom';

interface NavBarProps {
  userName?: string;
  onLogout: () => void;
}

export default function NavBar({ userName, onLogout }: NavBarProps) {
  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #e0e0e0',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link
        to="/dashboard"
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
          textDecoration: 'none'
        }}
      >
        DynoForm
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {userName && <span style={{ fontSize: '14px', color: '#666' }}>{userName}</span>}
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            border: '1px solid #e0e0e0',
            background: 'white',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
