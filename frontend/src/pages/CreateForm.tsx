import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAirtableStore } from '../store/airtableStore';
import { useFormsStore } from '../store/formsStore';
import BaseSelector from '../components/BaseSelector';
import TableSelector from '../components/TableSelector';
import FieldSelector from '../components/FieldSelector';
import FormDetailsEditor from '../components/FormDetailsEditor';
import ErrorAlert from '../components/ErrorAlert';
import PageHeader from '../components/PageHeader';
import type { FormField } from '../types/api';

export default function CreateForm() {
  const navigate = useNavigate();
  const {
    bases,
    tables,
    fields: availableFields,
    selectedBase,
    selectedTable,
    fetchBases,
    fetchTables,
    fetchFields,
    selectBase,
    selectTable,
    loading: airtableLoading,
    error: airtableError,
  } = useAirtableStore();

  const { createForm, loading: formLoading, error: formError } = useFormsStore();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<FormField[]>([]);

  useEffect(() => {
    fetchBases();
  }, [fetchBases]);

  const handleBaseSelect = (baseId: string) => {
    selectBase(baseId);
    fetchTables(baseId);
    setStep(2);
  };

  const handleTableSelect = (tableId: string) => {
    selectTable(tableId);
    if (selectedBase) {
      fetchFields(selectedBase, tableId);
      setStep(3);
    }
  };

  const toggleField = (field: any) => {
    const exists = selectedFields.find(f => f.fieldId === field.id);
    if (exists) {
      setSelectedFields(selectedFields.filter(f => f.fieldId !== field.id));
    } else {
      setSelectedFields([...selectedFields, {
        fieldId: field.id,
        label: field.name,
        type: field.mappedType || field.type,
        required: false,
        options: field.options,
      }]);
    }
  };

  const updateFieldRequired = (fieldId: string, required: boolean) => {
    setSelectedFields(selectedFields.map(f => 
      f.fieldId === fieldId ? { ...f, required } : f
    ));
  };

  const handleSubmit = async () => {
    if (!title || !selectedBase || !selectedTable || selectedFields.length === 0) {
      return;
    }

    try {
      await createForm({
        title,
        description,
        airtableBaseId: selectedBase,
        airtableTableId: selectedTable,
        fields: selectedFields,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <PageHeader title="Create Form" subtitle={`Step ${step} of 4`} />

      {(airtableError || formError) && (
        <ErrorAlert message={airtableError || formError || ''} />
      )}

      {step === 1 && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a1a1a' }}>
            Select Airtable Base
          </h2>
          <BaseSelector
            bases={bases}
            loading={airtableLoading}
            onSelect={handleBaseSelect}
          />
        </div>
      )}

      {step === 2 && (
        <TableSelector
          tables={tables}
          loading={airtableLoading}
          onSelect={handleTableSelect}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <FieldSelector
          availableFields={availableFields}
          selectedFields={selectedFields}
          loading={airtableLoading}
          onToggle={toggleField}
          onContinue={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <FormDetailsEditor
          title={title}
          description={description}
          selectedFields={selectedFields}
          loading={formLoading}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onFieldRequiredChange={updateFieldRequired}
          onSubmit={handleSubmit}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
}

