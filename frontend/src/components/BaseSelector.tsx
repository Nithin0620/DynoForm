import type { AirtableBase } from '../types/api';

interface BaseSelectorProps {
  bases: AirtableBase[];
  loading: boolean;
  onSelect: (baseId: string) => void;
}

export default function BaseSelector({ bases, loading, onSelect }: BaseSelectorProps) {
  if (loading) {
    return <p style={{ color: '#666', fontSize: '14px' }}>Loading bases...</p>;
  }

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      {bases.map((base) => (
        <div
          key={base.id}
          onClick={() => onSelect(base.id)}
          style={{
            padding: '16px',
            border: '1px solid #e0e0e0',
            cursor: 'pointer',
            background: 'white'
          }}
        >
          <div style={{ fontWeight: '500', fontSize: '14px', color: '#1a1a1a' }}>
            {base.name}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            {base.id}
          </div>
        </div>
      ))}
    </div>
  );
}
