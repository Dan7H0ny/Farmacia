import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CustomTextField from '../components/CustomTextField';
import { FiberPin, Password } from '@mui/icons-material';
import Captcha from '../components/Captcha';
import {useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/RPassword.css';
import CustomSwal from '../components/CustomSwal.jsx';

export const RPassword = () => {
  const navigate = useNavigate();
  const { IdUsuario } = useParams();
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [pin, setPin] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [repitaContraseña, setRepitaContraseña] = useState('');

  const handleCaptchaVerification = (isValid) => {
    setIsCaptchaValid(isValid);
  };
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isCaptchaValid) {
      CustomSwal({ icono: 'error', titulo: 'Error en captcha', mensaje: 'El captcha no coincide' });
      return;
    }

    if (nuevaContraseña !== repitaContraseña) {
      CustomSwal({ icono: 'error', titulo: 'Contraseñas distintas', mensaje: 'las contraseñas no coinciden' });
      return;
    }

    axios.post(`${UrlReact}/restablecer-password`, {IdUsuario, pin, nuevaContraseña })
      .then(response => {
        CustomSwal({ icono: 'success', titulo: 'Cambio de contraseña correcto', mensaje: response.mensaje });
        navigate('/login');
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'No se puede cambiar contraseña', mensaje: error.mensaje });
      });
  };

  return (
    <div className="password-container">
      <Box className="container">
        <Typography variant="h4" component="h1" sx={{ marginBottom: '20px', textAlign: 'center' }}>
          Restablecer Contraseña
        </Typography>
        <form onSubmit={handleSubmit}>
          <CustomTextField
            label="Pin"
            type="number"
            value={pin}
            onChange={(e) => { 
              const inputValue = e.target.value;
              if ( inputValue.length > 9) {
                setPin(inputValue.slice(0, 9));
              } 
              else { 
                setPin(inputValue);
              }
            }}
            placeholder="Ingrese el Pin Enviado a su correo"
            required
            icon={<FiberPin />}
          />
          <CustomTextField
            label="Nueva Contraseña"
            type="password"
            autoComplete="current-password"
            value={nuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            placeholder="**********"
            required
            icon={<Password />}
          />
          <CustomTextField
            label="Repetir Contraseña"
            type="password"
            autoComplete="current-password"
            value={repitaContraseña}
            onChange={(e) => setRepitaContraseña(e.target.value)}
            placeholder="**********"
            required
            icon={<Password />}
          />
          <Captcha onVerify={handleCaptchaVerification} />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Restablecer Contraseña
          </Button>
        </form>
      </Box>
    </div>
  );
};
