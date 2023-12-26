// src/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const addUrl = async (url) => {
  return axios.post(`${BASE_URL}/add-url`, { url });
};

export const addCache = async (input) => {
  return axios.post(`${BASE_URL}/add-cache`, { urls: input });
};

export const deleteCache = async (id) => {
  return axios.delete(`${BASE_URL}/delete-cache/${id}`);
};

export const getCache = async () => {
  return axios.get(`${BASE_URL}/get-cache`);
};

export const checkCache = async () => {
  return axios.get(`${BASE_URL}/cache`);
};

// Các hàm API khác...
