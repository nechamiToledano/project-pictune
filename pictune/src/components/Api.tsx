import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_KEY}/api`,
  withCredentials: true,

});

// Add an interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
