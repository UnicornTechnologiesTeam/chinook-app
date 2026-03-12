import { useState, useEffect } from "react";
import { searchTracks, getCustomers, createPurchase } from "../services/api";
import TrackCard from "../components/TrackCard";
import SearchBar from "../components/SearchBar";
import PurchaseModal from "../components/PurchaseModal";
import Alert from "../components/Alert";
import Cart from "../components/Cart";
import History from "../components/History";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [alert, setAlert] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => { loadTracks(); }, []);

  const loadTracks = async (q = "") => {
    try {
      const data = await searchTracks(q);
      setTracks(data);
    } catch {
      setAlert({ type: "error", message: "Error al cargar canciones." });
    }
  };

  const handleBuy = async (track) => {
    try {
      const data = await getCustomers();
      setCustomers(data);
      setSelectedTrack(track);
    } catch {
      setAlert({ type: "error", message: "Error al cargar clientes." });
    }
  };

  const handleConfirm = async (customerId) => {
    try {
      await createPurchase(parseInt(customerId), [selectedTrack.TrackId]);
      setSelectedTrack(null);
      setAlert({ type: "success", message: `¡Compraste "${selectedTrack.Name}" exitosamente!` });
      setTimeout(() => setAlert(null), 3000);
    } catch {
      setAlert({ type: "error", message: "Error al procesar la compra." });
    }
  };

  const handleAddToCart = (track) => {
    if (!cart.find(t => t.TrackId === track.TrackId)) {
      setCart([...cart, track]);
    }
  };

  const handleRemoveFromCart = (trackId) => {
    setCart(cart.filter(t => t.TrackId !== trackId));
  };

  const handleCartSuccess = (message) => {
    setAlert({ type: "success", message });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="app">
      <div className="app-header">
        <span style={{ fontSize: "1.4rem" }}>🎵</span>
        <h1>Chinook Music Store</h1>
        <SearchBar query={query} setQuery={setQuery} onSearch={() => loadTracks(query)} />
      </div>
      <div className="app-content">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        <h2 className="section-title">
          {query ? `Resultados para "${query}"` : "Canciones destacadas"}
        </h2>
        {tracks.length === 0 ? (
          <p className="no-results">No se encontraron canciones</p>
        ) : (
          <div className="tracks-grid">
            {tracks.map((track) => (
              <TrackCard
                key={track.TrackId}
                track={track}
                onBuy={() => handleBuy(track)}
                onAddToCart={handleAddToCart}
                inCart={!!cart.find(t => t.TrackId === track.TrackId)}
              />
            ))}
          </div>
        )}
      </div>
      {selectedTrack && (
        <PurchaseModal
          track={selectedTrack}
          customers={customers}
          onConfirm={handleConfirm}
          onCancel={() => setSelectedTrack(null)}
        />
      )}
      <Cart
        items={cart}
        onRemove={handleRemoveFromCart}
        onClear={() => setCart([])}
        onSuccess={handleCartSuccess}
      />
      <History />
    </div>
  );
}
