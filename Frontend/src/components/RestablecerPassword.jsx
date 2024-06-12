import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { TextField, Button, Typography, Box, Container, InputAdornment, Link } from '@mui/material';
import { AccountCircle,Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../assets/css/restar.css'; // Importa el archivo CSS

export const RestablecerPassword = () => {

  const [correo, setCorreo] = useState('');
  const navigate = useNavigate();

  const handleUserChange = (event) => {
    setCorreo(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:4000/enviarpin', {correo})
      .then(response => {
        Swal.fire({
            icon: 'success',
            title: 'Envio correcto',
            text: response.mensaje,
        });
        navigate(`/login`);
      })
      .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'El envio no se pudo concretar',
            text: error.mensaje,
        });
      });
  };
  return (
    <div className="background-container">
    <Container maxWidth="xs" sx={{ mt: 2, bgcolor: "#05152d", p: 4 }}>
      <AccountCircle sx={{ color: 'white', fontSize: '7rem' }} />
      <Typography variant="h4" component="h1" sx={{ mb: 2, textAlign: 'center', color: '#eeca06' }}>
        Restablecer la contraseña
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2}, backgroundColor: '#0a2d4b' }}>
        <TextField
          id="txtusu"
          label="correo"
          type="email"
          value={correo}
          onChange={handleUserChange}
          fullWidth
          required
          InputProps={{
            sx: { color: '#eeca06' },
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#eeca06' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ sx: { color: '#eeca06' } }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ backgroundColor: 'white', color: '#03112a' }}>
          Enviar
        </Button>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: '#eeca06' }}>
          <Link href="/login" color="inherit">
            Volver al login
          </Link>
        </Typography>
      </Box>
    </Container>
    </div>
  )
}
