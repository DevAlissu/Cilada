import axios from 'axios';

const api = axios.create({
  baseURL: process.env.UPLOAD_FOTOS,
});

export default api;
