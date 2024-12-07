import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend base URL
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
  }
  return config;
}, (error) => Promise.reject(error));

export default API;
