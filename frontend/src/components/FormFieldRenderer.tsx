import type { FormField } from '../types/api';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}

export default function FormFieldRenderer({ field, value, error, onChange }: FormFieldRendererProps) {
  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: `1px solid ${error ? '#c00' : '#e0e0e0'}`,
    fontSize: '14px',
    outline: 'none'
  };

  switch (field.type) {
    case 'shortText':
    case 'singleLineText':
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={field.required ? `${field.label} *` : field.label}
        />
      );

    case 'longText':
    case 'multilineText':
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder={field.required ? `${field.label} *` : field.label}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={field.required ? `${field.label} *` : field.label}
        />
      );

    case 'email':
      return (
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={field.required ? `${field.label} *` : field.label}
        />
      );

    case 'url':
      return (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={field.required ? `${field.label} *` : field.label}
        />
      );

    case 'phone':
    case 'phoneNumber':
      return (
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={field.required ? `${field.label} *` : field.label}
        />
      );

    case 'singleSelect':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case 'multipleSelects':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {field.options?.map((option) => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={(value || []).includes(option)}
                onChange={(e) => {
                  const current = value || [];
                  const updated = e.target.checked
                    ? [...current, option]
                    : current.filter((v: string) => v !== option);
                  onChange(updated);
                }}
                style={{ marginRight: '8px' }}
              />
              {option}
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          {field.label}
        </label>
      );

    case 'date':
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      );

    case 'dateTime':
      return (
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      );

    case 'rating':
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${value === rating ? '#1a1a1a' : '#e0e0e0'}`,
                background: value === rating ? '#1a1a1a' : 'white',
                color: value === rating ? 'white' : '#1a1a1a',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {rating}
            </button>
          ))}
        </div>
      );

    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          placeholder={field.required ? `${field.label} *` : field.label}
        />
      );
  }
}
