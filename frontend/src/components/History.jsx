import { useState } from 'react'
import { getCustomers } from '../services/api'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function History() {
  const [open, setOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const handleOpen = async () => {
    const data = await getCustomers()
    setCustomers(data)
    setOpen(true)
  }

  const handleSelectCustomer = async (customerId) => {
    setSelectedCustomer(customerId)
    if (!customerId) return
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/customers/${customerId}/history`)
      setHistory(res.data)
    } catch {
      setHistory([])
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={handleOpen} style={{
        position: 'fixed', bottom: '32px', right: '180px',
        background: '#e8192c', color: '#fff',
        border: '1px solid #535353', borderRadius: '50px',
        padding: '14px 24px', fontWeight: '700',
        fontSize: '15px', cursor: 'pointer',
        zIndex: 999,
      }}>
        📋 Historial
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
            padding: '32px', width: '580px', maxWidth: '90vw',
            maxHeight: '80vh', overflowY: 'auto'
          }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>📋 Historial de compras</h2>

            <select value={selectedCustomer} onChange={e => handleSelectCustomer(e.target.value)} style={{
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

            {loading && <p style={{ color: '#b3b3b3' }}>Cargando...</p>}

            {!loading && selectedCustomer && history.length === 0 && (
              <p style={{ color: '#b3b3b3' }}>No hay compras registradas.</p>
            )}

            {history.map(inv => (
              <div key={inv.InvoiceId} style={{
                background: '#1a1a1a', borderRadius: '8px',
                padding: '16px', marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#b3b3b3', fontSize: '13px' }}>
                    Factura #{inv.InvoiceId} · {new Date(inv.InvoiceDate).toLocaleDateString()}
                  </span>
                  <span style={{ color: '#e8192c', fontWeight: '700' }}>${inv.Total}</span>
                </div>
                {inv.lines.map(line => (
                  <div key={line.TrackId} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0', borderTop: '1px solid #282828'
                  }}>
                    <span style={{ color: '#fff', fontSize: '14px' }}>🎵 {line.track_name}</span>
                    <span style={{ color: '#b3b3b3', fontSize: '13px' }}>${line.UnitPrice}</span>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => { setOpen(false); setHistory([]); setSelectedCustomer('') }} style={{
                padding: '10px 24px', borderRadius: '20px',
                border: '1px solid #535353', background: 'transparent',
                color: '#fff', cursor: 'pointer', fontSize: '14px',
              }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
