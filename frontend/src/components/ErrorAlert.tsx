interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div style={{
      padding: '12px',
      background: '#fee',
      border: '1px solid #fcc',
      marginBottom: '16px',
      fontSize: '14px',
      color: '#c00'
    }}>
      {message}
    </div>
  );
}
