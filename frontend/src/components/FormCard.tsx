import { Link } from 'react-router-dom';
import type { FormSchema } from '../types/api';

interface FormCardProps {
  form: FormSchema;
}

export default function FormCard({ form }: FormCardProps) {
  const handleCopyLink = () => {
    const url = `${window.location.origin}/submit/${form._id}`;
    navigator.clipboard.writeText(url);
    alert('Form link copied to clipboard!');
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #e0e0e0',
        background: 'white'
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#1a1a1a' }}>
          {form.title}
        </h3>
        {form.description && (
          <p style={{ fontSize: '14px', color: '#666' }}>
            {form.description}
          </p>
        )}
      </div>
      <div style={{
        display: 'flex',
        gap: '12px',
        fontSize: '12px',
        color: '#999',
        marginBottom: '16px'
      }}>
        <span>{form.fields.length} fields</span>
        <span>•</span>
        <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link
          to={`/forms/${form._id}/responses`}
          style={{
            padding: '8px 16px',
            border: '1px solid #e0e0e0',
            background: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            color: '#1a1a1a',
            display: 'inline-block'
          }}
        >
          View Responses
        </Link>
        <button
          onClick={handleCopyLink}
          style={{
            padding: '8px 16px',
            border: '1px solid #e0e0e0',
            background: 'white',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
