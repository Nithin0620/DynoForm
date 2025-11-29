interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: '#666', fontSize: '14px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
