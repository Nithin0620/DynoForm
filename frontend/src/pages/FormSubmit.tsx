import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFormsStore } from '../store/formsStore';
import { forms } from '../lib/api';
import FormFieldRenderer from '../components/FormFieldRenderer';
import PageHeader from '../components/PageHeader';

export default function FormSubmit() {
  const { formId } = useParams<{ formId: string }>();
  const { currentForm, fetchForm, loading } = useFormsStore();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (formId) {
      fetchForm(formId);
    }
  }, [formId, fetchForm]);

  useEffect(() => {
    if (currentForm) {
      const initialVisible = new Set(currentForm.fields.map(f => f.fieldId));
      setVisibleFields(initialVisible);
    }
  }, [currentForm]);

  useEffect(() => {
    if (currentForm) {
      updateVisibility();
    }
  }, [formData, currentForm]);

  const updateVisibility = () => {
    if (!currentForm) return;

    const visible = new Set<string>();
    
    currentForm.fields.forEach(field => {
      let shouldShow = true;

      if (field.conditionalLogic && field.conditionalLogic.length > 0) {
        field.conditionalLogic.forEach(logic => {
          const triggerValue = formData[logic.fieldId];
          let conditionMet = false;

          switch (logic.operator) {
            case 'equals':
              conditionMet = triggerValue === logic.value;
              break;
            case 'notEquals':
              conditionMet = triggerValue !== logic.value;
              break;
            case 'contains':
              conditionMet = String(triggerValue || '').includes(String(logic.value));
              break;
            case 'greaterThan':
              conditionMet = Number(triggerValue) > Number(logic.value);
              break;
            case 'lessThan':
              conditionMet = Number(triggerValue) < Number(logic.value);
              break;
          }

          if (conditionMet && logic.action === 'hide') {
            shouldShow = false;
          } else if (!conditionMet && logic.action === 'show') {
            shouldShow = false;
          }
        });
      }

      if (shouldShow) {
        visible.add(field.fieldId);
      }
    });

    setVisibleFields(visible);
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: '' });
    }
  };

  const validateForm = (): boolean => {
    if (!currentForm) return false;

    const newErrors: Record<string, string> = {};

    currentForm.fields.forEach(field => {
      if (field.required && visibleFields.has(field.fieldId)) {
        const value = formData[field.fieldId];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.fieldId] = `${field.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !formId) return;

    setSubmitting(true);

    try {
      await forms.submit(formId, formData);
      setSubmitted(true);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading form...</p>
      </div>
    );
  }

  if (!currentForm) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Form not found</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', textAlign: 'center' }}>
        <div style={{
          padding: '48px',
          border: '1px solid #e0e0e0',
          background: 'white'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
            Form Submitted
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Thank you for your submission
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <PageHeader title={currentForm.title} subtitle={currentForm.description} />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {currentForm.fields.map((field) => (
            <div key={field.fieldId}>
              {visibleFields.has(field.fieldId) && (
                <>
                  {field.type !== 'checkbox' && (
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1a1a1a'
                    }}>
                      {field.label}
                      {field.required && <span style={{ color: '#c00' }}> *</span>}
                    </label>
                  )}
                  <FormFieldRenderer
                    field={field}
                    value={formData[field.fieldId] || ''}
                    error={errors[field.fieldId]}
                    onChange={(value) => handleChange(field.fieldId, value)}
                  />
                  {errors[field.fieldId] && (
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#c00' }}>
                      {errors[field.fieldId]}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px',
            background: submitting ? '#e0e0e0' : '#1a1a1a',
            color: submitting ? '#999' : 'white',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: submitting ? 'not-allowed' : 'pointer',
            marginTop: '32px'
          }}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
