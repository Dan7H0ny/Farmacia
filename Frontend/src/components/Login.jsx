import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Typography, Box, Container, InputAdornment, Link, Button } from '@mui/material';
import { AccountCircle, Email, Password } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useAutenticarContexto } from "../contextos/autenticar";
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css'; // Importa el archivo CSS

export const Login = () => {
  const navigate = useNavigate();
  const [ correo, setCorreo ] = useState('');
  const [ password, setPassword ] = useState('');
  const { iniciarSesion } = useAutenticarContexto();


  const handleUserChange = (event) => {
    setCorreo(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', {
        correo: correo,
        password: password
      });
      Swal.fire({
        icon: 'success',
        title: 'Acceso correcto',
        text: response.mensaje,
      });
      
      iniciarSesion(response._id, response.nombre, response.rol, response.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`
      if (response.rol === 'Administrador') {
        navigate('/Menu/Administrador')
      } else if (response.rol === 'Cajero') {
        navigate('/Menu/Cajero')
      } else {
        navigate('/login')
      }
    } catch (error) {
      Swal.fire({
        icon:  'error',
        title: 'Acceso denegado',
        text:  error.mensaje,
      });
    }
  };

  return (
    <div className="background-container">
    <Container maxWidth="xs" sx={{ mt: 2, bgcolor: "#0a2d4b", p: 4, border: '5px solid #eeca06', borderRadius: '10px'  }}>
      <AccountCircle sx={{ color: '#eeca06', fontSize: '7rem' }} />
      <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center', color: '#eeca06', fontFamily: 'Roboto Slab, serif' }}>
        INICIO DE SESION
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2}, backgroundColor: '#0a2d4b', fontFamily: 'Roboto Slab, serif' }}>
        <TextField
          id="txtusu"
          label="Correo"
          type="email"
          value={correo}
          onChange={handleUserChange}
          fullWidth
          required
          InputProps={{
            sx: { 
              color: '#eeca06',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#eeca06',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#eeca06',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#eeca06',
              },
            },
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#eeca06' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ sx: { color: '#eeca06' } }}
        />
        <TextField
          id="txtpas"
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          required
          InputProps={{
            sx: { 
              color: '#eeca06',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#eeca06',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#eeca06',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#eeca06',
              },
            },
            startAdornment: (
              <InputAdornment position="start">
                <Password sx={{ color: '#eeca06' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ sx: { color: '#eeca06' } }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, backgroundColor: '#eeca06', 
          color: '#022031', '&:hover': {backgroundColor: '#022031', color: '#eeca06'}}}>
          INGRESAR AL SISTEMA
        </Button>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: '#eeca06'  }}>
          <Link href="/reset-password" sx={{ color: '#eeca06', '&:hover': { backgroundColor: '#022031', color: '#eeca06'}}}>
            ¿Olvidaste tu contraseña?
          </Link>
        </Typography>
      </Box>
    </Container>
    </div>
  )
}
