import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} data-testid="search-form" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por canción, artista o género..."
        data-testid="search-input"
        style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
      />
      <button type="submit" data-testid="search-button" style={{ padding: '10px 20px', backgroundColor: '#1db954', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        Buscar
      </button>
      {query && (
        <button type="button" onClick={handleClear} data-testid="clear-button" style={{ padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Limpiar
        </button>
      )}
    </form>
  );
}

export default SearchBar;