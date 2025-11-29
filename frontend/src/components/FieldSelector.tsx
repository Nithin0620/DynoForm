import type { AirtableField, FormField } from '../types/api';

interface FieldSelectorProps {
  availableFields: AirtableField[];
  selectedFields: FormField[];
  loading: boolean;
  onToggle: (field: AirtableField) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function FieldSelector({
  availableFields,
  selectedFields,
  loading,
  onToggle,
  onContinue,
  onBack
}: FieldSelectorProps) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          padding: '8px 16px',
          border: '1px solid #e0e0e0',
          background: 'white',
          cursor: 'pointer',
          marginBottom: '16px',
          fontSize: '14px'
        }}
      >
        ← Back
      </button>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a1a1a' }}>
        Select Fields
      </h2>
      {loading ? (
        <p style={{ color: '#666', fontSize: '14px' }}>Loading fields...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
            {availableFields.map((field) => {
              const isSelected = selectedFields.some(f => f.fieldId === field.id);
              return (
                <div
                  key={field.id}
                  onClick={() => onToggle(field)}
                  style={{
                    padding: '16px',
                    border: `1px solid ${isSelected ? '#1a1a1a' : '#e0e0e0'}`,
                    cursor: 'pointer',
                    background: isSelected ? '#fafafa' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                        {field.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        {field.mappedType || field.type}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ fontSize: '14px', color: '#1a1a1a' }}>✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={onContinue}
            disabled={selectedFields.length === 0}
            style={{
              width: '100%',
              padding: '12px',
              background: selectedFields.length === 0 ? '#e0e0e0' : '#1a1a1a',
              color: selectedFields.length === 0 ? '#999' : 'white',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: selectedFields.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}
