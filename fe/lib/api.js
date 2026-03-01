import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const ARTIC_URL = 'https://api.artic.edu/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getProjects = (page = 1, limit = 10) =>
  api.get('/projects', { params: { page, limit } });

export const createProject = (data) => api.post('/projects', data);

export const getProject = (id) => api.get(`/projects/${id}`);

export const updateProject = (id, data) => api.put(`/projects/${id}`, data);

export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getPlaces = (projectId) =>
  api.get(`/projects/${projectId}/places`);

export const addPlace = (projectId, data) =>
  api.post(`/projects/${projectId}/places`, data);

export const getPlace = (projectId, placeId) =>
  api.get(`/projects/${projectId}/places/${placeId}`);

export const updatePlace = (projectId, placeId, data) =>
  api.patch(`/projects/${projectId}/places/${placeId}`, data);

export const searchArtworks = async (query) => {
  const response = await axios.get(`${ARTIC_URL}/artworks/search`, {
    params: { q: query, limit: 10, fields: 'id,title,image_id' },
  });
  return response.data.data.map((item) => ({
    id: item.id,
    title: item.title,
    image_url: item.image_id
      ? `https://www.artic.edu/iiif/2/${item.image_id}/full/200,/0/default.jpg`
      : null,
  }));
};

export default api;
