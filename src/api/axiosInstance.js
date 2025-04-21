import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://interview.propmall.my',
  headers: {
    Authorization: 'Bearer 67ce6d78ad121633723921',
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
