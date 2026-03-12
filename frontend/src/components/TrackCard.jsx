function formatDuration(ms) {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

function TrackCard({ track, onBuy, onAddToCart, inCart }) {
  return (
    <div data-testid="track-card" style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px', borderRadius: '6px',
      transition: 'background 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px', height: '48px', background: '#282828',
          borderRadius: '4px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '20px'
        }}>🎵</div>
        <div>
          <div data-testid="track-name" style={{ fontWeight: '600', fontSize: '15px', color: '#fff' }}>{track.Name}</div>
          <div data-testid="track-artist" style={{ fontSize: '13px', color: '#b3b3b3', marginTop: '2px' }}>
            {track.artist_name} · {track.album_title}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
            <span data-testid="track-genre" style={{ fontSize: '12px', color: '#535353' }}>{track.genre_name}</span>
            {track.Milliseconds && (
              <span style={{ fontSize: '12px', color: '#535353' }}>⏱ {formatDuration(track.Milliseconds)}</span>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span data-testid="track-price" style={{ color: '#b3b3b3', fontSize: '14px' }}>${track.UnitPrice}</span>
        <button onClick={() => onAddToCart(track)} style={{
          background: inCart ? '#535353' : '#282828',
          color: inCart ? '#b3b3b3' : '#fff',
          border: `1px solid ${inCart ? '#535353' : '#e8192c'}`,
          borderRadius: '20px', padding: '7px 16px', fontSize: '13px',
          cursor: inCart ? 'default' : 'pointer',
        }}>
          {inCart ? '✓ En carrito' : '+ Carrito'}
        </button>
        <button data-testid="buy-button" onClick={() => onBuy(track)} style={{
          background: '#e8192c', color: '#fff', border: 'none',
          borderRadius: '20px', padding: '8px 20px',
          fontWeight: '700', fontSize: '13px', cursor: 'pointer',
        }}>Comprar</button>
      </div>
    </div>
  )
}
export default TrackCard
