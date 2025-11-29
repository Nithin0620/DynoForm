import type { FormResponse, FormSchema } from '../types/api';

interface ResponseCardProps {
  response: FormResponse;
  form: FormSchema;
}

export default function ResponseCard({ response, form }: ResponseCardProps) {
  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #e0e0e0',
        background: 'white'
      }}
    >
      <div style={{
        fontSize: '12px',
        color: '#999',
        marginBottom: '16px'
      }}>
        Submitted {new Date(response.submittedAt).toLocaleString()}
      </div>
      <div style={{ display: 'grid', gap: '12px' }}>
        {form.fields.map((field) => {
          const value = response.data[field.fieldId];
          if (value === undefined || value === null || value === '') return null;

          return (
            <div key={field.fieldId}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {field.label}
              </div>
              <div style={{ fontSize: '14px', color: '#1a1a1a' }}>
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
