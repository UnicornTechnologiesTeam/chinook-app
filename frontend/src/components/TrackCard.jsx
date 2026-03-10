function TrackCard({ track, onBuy }) {
  return (
    <div data-testid="track-card" style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      backgroundColor: '#fff'
    }}>
      <div>
        <h3 data-testid="track-name" style={{ margin: '0 0 4px 0' }}>{track.Name}</h3>
        <p data-testid="track-artist" style={{ margin: '0 0 2px 0', color: '#666' }}>{track.artist_name}</p>
        <p data-testid="track-genre" style={{ margin: 0, color: '#999', fontSize: '14px' }}>{track.genre_name}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p data-testid="track-price" style={{ fontWeight: 'bold', fontSize: '18px', margin: '0 0 8px 0' }}>
          ${Number(track.UnitPrice).toFixed(2)}
        </p>
        <button
          onClick={() => onBuy(track)}
          data-testid="buy-button"
          style={{ padding: '8px 16px', backgroundColor: '#1db954', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Comprar
        </button>
      </div>
    </div>
  );
}

export default TrackCard;