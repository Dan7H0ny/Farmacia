import React, { useState } from 'react';
import axios from 'axios';
import CustomTextField from '../components/CustomTextField';
import CustomSwal from '../components/CustomSwal.jsx';
import { createRoot } from 'react-dom/client';
import { Typography, Box, Button } from '@mui/material';
import { AccountCircle, Email, Password } from '@mui/icons-material';
import { useAutenticarContexto } from "../contextos/autenticar.js";
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css';
import imagen from '../assets/images/LogoFar.png';
import Swal from 'sweetalert2';
import {BlinkBlur} from 'react-loading-indicators'

export const Login = () => {
  const navigate = useNavigate();
  const [ correo, setCorreo ] = useState('');
  const [ password, setPassword ] = useState('');
  const { iniciarSesion } = useAutenticarContexto();
  const [ isSignIn, setIsSignIn ] = useState(true);

  const btnCambioEstado = () => {
    setIsSignIn(!isSignIn);
    setCorreo('');
    setPassword('');
  };
  
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;

  const btnInicioSesion = (e) => {
    e.preventDefault();
    axios.post(`${UrlReact}/login`, { correo, password })
      .then(response => {
        CustomSwal({ icono: 'success', titulo: 'Acceso correcto', mensaje: response.mensaje });
        iniciarSesion(response._id, response.nombre, response.rol, response.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        if (response.rol === 'Administrador') {
          navigate('/Menu/Administrador');
        } else if (response.rol === 'Cajero') {
          navigate('/Menu/Cajero');
        } else {
          navigate('/login');
        }
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Acceso Denegado', mensaje: error.mensaje });
      });
  };

  const btnRestablecerPassword = (e) => {
    e.preventDefault();
    const containerroot = document.createElement('div');
    const root = createRoot(containerroot);
    root.render(
      <BlinkBlur color="#e2e2e2" size="medium" text="" textColor="" /> 
    );
    Swal.fire({
      title: 'CARGANDO...',
      html: containerroot,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        const container = Swal.getPopup();
        container.style.width = '350px';
        container.style.height = '250px';  
        container.style.color = '#e2e2e2';
        container.style.background = '#0f1b35';
      }
    });
    axios.post(`${UrlReact}/enviarpin`, { correo })
      .then(response => {
        Swal.close();
        CustomSwal({ icono: 'success', titulo: 'Envio correcto', mensaje: response.mensaje });
      })
      .catch(error => {
        Swal.close();
        CustomSwal({ icono: 'error', titulo: 'El envio no se pudo concretar', mensaje: error.mensaje });
      });
  };

  const btnMain = (e) => {
    if (isSignIn) {
      btnInicioSesion(e);
    } else {
      btnRestablecerPassword(e);
    }
  };

  return (
    <Box className="login-container" >
      <Box className={`container ${isSignIn ? '' : 'active'}`} id="container">
        <Box className={`form-container ${isSignIn ? 'sign-in' : 'sign-up'}`}>
          <form onSubmit={btnMain}>
            <AccountCircle sx={{ fontSize: '8rem' }} />
            <Typography variant="h5" component="h1" sx={{ padding: '15px' }}>{isSignIn ? 'INICIO DE SESION' : 'RESTABLECER CONTRASEÑA'}</Typography>
            <CustomTextField
              id="txtusu"
              label="Correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Admin@123.com"
              required={true}
              icon={<Email />}
            />
            {isSignIn && (
              <CustomTextField
                id="txtpas"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="**********"
                required={true}
                icon={<Password/>}
              />
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isSignIn ? 'Ingresar al sistema' : 'Recuperar Contraseña'}
            </Button>
            <Button className="hidden" variant="contained" color="primary" fullWidth onClick={btnCambioEstado}>
              {isSignIn ? '¿olvidaste tu contraseña?' : 'Volver al inicio de sesion'}
            </Button>
          </form>
        </Box>
        <Box className="toggle-container">
          <Box className="toggle">
            <Box className={`toggle-panel ${isSignIn ? 'toggle-right' : 'toggle-left'}`}>
              <img src={imagen} alt="Logo" style={{ maxWidth: '100%', maxHeight: '50%', padding:'15px'}} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
