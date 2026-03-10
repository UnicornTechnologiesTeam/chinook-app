import { useState, useEffect } from 'react';
import { getCustomers, createPurchase } from '../services/api';

function PurchaseModal({ track, onSuccess, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCustomers().then(setCustomers).catch(() => setError('Error cargando clientes'));
  }, []);

  const handleBuy = async () => {
    if (!selectedCustomer) {
      setError('Selecciona un cliente');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const invoice = await createPurchase(Number(selectedCustomer), [track.TrackId]);
      onSuccess(invoice);
    } catch (err) {
      setError('Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '12px',
        padding: '32px', width: '400px', maxWidth: '90%'
      }}>
        <h2 style={{ marginTop: 0 }}>Comprar canción</h2>
        <p><strong>{track.Name}</strong> — {track.artist_name}</p>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1db954' }}>
          ${Number(track.UnitPrice).toFixed(2)}
        </p>

        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Selecciona cliente:
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '16px', fontSize: '14px' }}
        >
          <option value="">-- Seleccionar --</option>
          {customers.map(c => (
            <option key={c.CustomerId} value={c.CustomerId}>
              {c.FirstName} {c.LastName} ({c.Email})
            </option>
          ))}
        </select>

        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleBuy}
            disabled={loading}
            style={{ flex: 1, padding: '12px', backgroundColor: '#1db954', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
          >
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', backgroundColor: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseModal;