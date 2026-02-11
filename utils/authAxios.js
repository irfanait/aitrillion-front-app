// utils/authAxios.js
import axios from 'axios';

const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default authAxios;
