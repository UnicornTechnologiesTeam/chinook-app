import { useState } from 'react'
function PurchaseModal({ track, customers, onConfirm, onCancel }) {
  const [selectedCustomer, setSelectedCustomer] = useState('')
  
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#282828',
        borderRadius: '12px',
        padding: '32px',
        width: '480px',
        maxWidth: '90vw',
      }}>
        <h2 style={{ color: '#fff', marginBottom: '8px' }}>Confirmar compra</h2>
        <p style={{ color: '#b3b3b3', marginBottom: '24px', fontSize: '14px' }}>
          🎵 {track?.Name} — <span style={{ color: '#e8192c' }}>${track?.UnitPrice}</span>
        </p>

        <label style={{ color: '#b3b3b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
          Selecciona tu cuenta
        </label>
        <select
          value={selectedCustomer}
          onChange={e => setSelectedCustomer(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '6px',
            background: '#3e3e3e',
            color: '#fff',
            border: 'none',
            fontSize: '14px',
            marginBottom: '24px',
            outline: 'none',
          }}
        >
          <option value="">-- Seleccionar cliente --</option>
          {customers.map(c => (
            <option key={c.CustomerId} value={c.CustomerId}>
              {c.FirstName} {c.LastName} ({c.Email})
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '10px 24px',
            borderRadius: '20px',
            border: '1px solid #535353',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
          }}>Cancelar</button>
          <button
            onClick={() => selectedCustomer && onConfirm(selectedCustomer)}
            style={{
              padding: '10px 24px',
              borderRadius: '20px',
              border: 'none',
              background: selectedCustomer ? '#e8192c' : '#535353',
              color: '#000',
              fontWeight: '700',
              cursor: selectedCustomer ? 'pointer' : 'not-allowed',
              fontSize: '14px',
            }}>Comprar</button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal