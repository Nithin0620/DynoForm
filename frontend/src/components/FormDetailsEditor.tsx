import type { FormField } from '../types/api';

interface FormDetailsEditorProps {
  title: string;
  description: string;
  selectedFields: FormField[];
  loading: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onFieldRequiredChange: (fieldId: string, required: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function FormDetailsEditor({
  title,
  description,
  selectedFields,
  loading,
  onTitleChange,
  onDescriptionChange,
  onFieldRequiredChange,
  onSubmit,
  onBack
}: FormDetailsEditorProps) {
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
        Form Details
      </h2>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
          Form Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter form title"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #e0e0e0',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Optional description"
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #e0e0e0',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical'
          }}
        />
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
        Configure Fields
      </h3>
      
      <div style={{ marginBottom: '24px' }}>
        {selectedFields.map((field) => (
          <div
            key={field.fieldId}
            style={{
              padding: '16px',
              border: '1px solid #e0e0e0',
              marginBottom: '12px',
              background: 'white'
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                {field.label}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                {field.type}
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onFieldRequiredChange(field.fieldId, e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Required field
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={onSubmit}
        disabled={!title || loading}
        style={{
          width: '100%',
          padding: '12px',
          background: !title || loading ? '#e0e0e0' : '#1a1a1a',
          color: !title || loading ? '#999' : 'white',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          cursor: !title || loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Creating...' : 'Create Form'}
      </button>
    </div>
  );
}
