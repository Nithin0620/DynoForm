import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFormsStore } from '../store/formsStore';
import ResponseCard from '../components/ResponseCard';

export default function FormResponses() {
  const { formId } = useParams<{ formId: string }>();
  const { currentForm, currentResponses, fetchForm, fetchResponses, loading } = useFormsStore();

  useEffect(() => {
    if (formId) {
      fetchForm(formId);
      fetchResponses(formId);
    }
  }, [formId, fetchForm, fetchResponses]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!currentForm) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Form not found</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 24px'
      }}>
        <Link
          to="/dashboard"
          style={{
            fontSize: '14px',
            color: '#1a1a1a',
            textDecoration: 'none'
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
            {currentForm.title}
          </h1>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {currentResponses.length} response{currentResponses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {currentResponses.length === 0 ? (
          <div style={{
            padding: '48px',
            border: '1px solid #e0e0e0',
            background: 'white',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '14px' }}>No responses yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {currentResponses.map((response) => (
              <ResponseCard
                key={response._id}
                response={response}
                form={currentForm}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
