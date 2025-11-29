import type { AirtableTable } from '../types/api';

interface TableSelectorProps {
  tables: AirtableTable[];
  loading: boolean;
  onSelect: (tableId: string) => void;
  onBack: () => void;
}

export default function TableSelector({ tables, loading, onSelect, onBack }: TableSelectorProps) {
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
        Select Table
      </h2>
      {loading ? (
        <p style={{ color: '#666', fontSize: '14px' }}>Loading tables...</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => onSelect(table.id)}
              style={{
                padding: '16px',
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <div style={{ fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
                {table.name}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {table.fields.length} fields
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
