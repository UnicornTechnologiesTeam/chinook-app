import { useState } from 'react'
import { getCustomers, createPurchase } from '../services/api'

export default function Cart({ items, onRemove, onClear, onSuccess }) {
  const [open, setOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [loading, setLoading] = useState(false)

  const total = items.reduce((sum, t) => sum + parseFloat(t.UnitPrice), 0)

  const handleOpen = async () => {
    const data = await getCustomers()
    setCustomers(data)
    setOpen(true)
  }

  const handleConfirm = async () => {
    if (!selectedCustomer) return
    setLoading(true)
    try {
      await createPurchase(parseInt(selectedCustomer), items.map(t => t.TrackId))
      setOpen(false)
      setSelectedCustomer('')
      onClear()
      onSuccess(`¡Compraste ${items.length} canción(es) por $${total.toFixed(2)}!`)
    } catch {
      onSuccess('Error al procesar la compra.')
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={handleOpen} style={{
        position: 'fixed', bottom: '32px', right: '32px',
        background: '#e8192c', color: '#fff',
        border: 'none', borderRadius: '50px',
        padding: '14px 24px', fontWeight: '700',
        fontSize: '15px', cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(29,185,84,0.4)',
        display: 'flex', alignItems: 'center', gap: '8px',
        zIndex: 999,
      }}>
        🛒 {items.length > 0 && (
          <span style={{
            background: '#000', color: '#e8192c',
            borderRadius: '50%', width: '22px', height: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700'
          }}>{items.length}</span>
        )}
        Carrito
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#282828', borderRadius: '12px',
            padding: '32px', width: '520px', maxWidth: '90vw',
            maxHeight: '80vh', overflowY: 'auto'
          }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>🛒 Tu carrito</h2>

            {items.length === 0 ? (
              <p style={{ color: '#b3b3b3' }}>El carrito está vacío.</p>
            ) : (
              <>
                {items.map(t => (
                  <div key={t.TrackId} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '10px 0',
                    borderBottom: '1px solid #3e3e3e'
                  }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: '600' }}>{t.Name}</div>
                      <div style={{ color: '#b3b3b3', fontSize: '13px' }}>{t.artist_name}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#e8192c' }}>${t.UnitPrice}</span>
                      <button onClick={() => onRemove(t.TrackId)} style={{
                        background: 'none', border: 'none',
                        color: '#535353', cursor: 'pointer', fontSize: '18px'
                      }}>✕</button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '16px', marginBottom: '24px', textAlign: 'right' }}>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>
                    Total: <span style={{ color: '#e8192c' }}>${total.toFixed(2)}</span>
                  </span>
                </div>

                <label style={{ color: '#b3b3b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Selecciona tu cuenta
                </label>
                <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} style={{
                  width: '100%', padding: '12px 16px', borderRadius: '6px',
                  background: '#3e3e3e', color: '#fff', border: 'none',
                  fontSize: '14px', marginBottom: '24px', outline: 'none',
                }}>
                  <option value="">-- Seleccionar cliente --</option>
                  {customers.map(c => (
                    <option key={c.CustomerId} value={c.CustomerId}>
                      {c.FirstName} {c.LastName} ({c.Email})
                    </option>
                  ))}
                </select>
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setOpen(false)} style={{
                padding: '10px 24px', borderRadius: '20px',
                border: '1px solid #535353', background: 'transparent',
                color: '#fff', cursor: 'pointer', fontSize: '14px',
              }}>Cerrar</button>
              {items.length > 0 && (
                <button onClick={handleConfirm} disabled={!selectedCustomer || loading} style={{
                  padding: '10px 24px', borderRadius: '20px', border: 'none',
                  background: selectedCustomer ? '#e8192c' : '#535353',
                  color: '#fff', fontWeight: '700', fontSize: '14px',
                  cursor: selectedCustomer ? 'pointer' : 'not-allowed',
                }}>
                  {loading ? 'Procesando...' : 'Confirmar compra'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
