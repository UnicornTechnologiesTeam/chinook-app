import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_URL });

export const searchTracks = async (query = '', skip = 0, limit = 20) => {
  const params = { skip, limit };
  if (query) params.q = query;
  const response = await api.get('/tracks/', { params });
  return response.data;
};

export const getTrack = async (trackId) => {
  const response = await api.get(`/tracks/${trackId}`);
  return response.data;
};

export const createPurchase = async (customerId, trackIds) => {
  const response = await api.post('/purchases/', {
    customer_id: customerId,
    track_ids: trackIds,
  });
  return response.data;
};

export const getCustomers = async () => {
  const response = await api.get('/customers/');
  return response.data;
};

export default api;