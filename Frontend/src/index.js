import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import axios from 'axios';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AutenticarContextoProveedor } from './contextos/autenticar';

axios.defaults.baseURL = 'http://192.168.1.133:3000'
axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('token')}`
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

axios.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error.response.data)
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AutenticarContextoProveedor>
      <App />
    </AutenticarContextoProveedor>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
