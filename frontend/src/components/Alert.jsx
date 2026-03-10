function Alert({ type, message, onClose }) {
  const colors = {
    success: '#d4edda',
    error: '#f8d7da',
  };
  return (
    <div data-testid="alert" style={{
      padding: '12px 20px',
      backgroundColor: colors[type],
      borderRadius: '6px',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
    </div>
  );
}

export default Alert;