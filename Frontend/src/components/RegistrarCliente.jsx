import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { TextField, Button ,Typography, InputAdornment, Grid, Box } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {PersonAddAlt, Badge } from '@mui/icons-material';

export const RegistrarCliente = ( ) => {

  const [ nombre, setNombre ] = useState('');
  const [ apellido, setApellido ] = useState('');
  const [ nit_ci_cex, setIdentificacion ] = useState('');
  const [ Fecha, setFecha ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener la fecha actual en la zona horaria local
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setFecha(formattedDate);
  }, []);

  const obtenerToken = () => {
    // Obtener el token del local storage
    const token = localStorage.getItem('token');
    return token;
  };

  const token = obtenerToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
 
  const botonGuardarCliente = (e) => {
    e.preventDefault();
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: 'Error al obtener el token de acceso',
      });
      navigate('/Menu/Administrador')
      return;
    }
    else
    {
    const NewClient = { nombre, apellido, nit_ci_cex, fecha_registro: Fecha };
    axios.post('http://localhost:4000/cliente/crear', NewClient, config)
      .then(response => {

        Swal.fire({
          icon: 'success',
          title: 'Cliente Creado',
          text: response.mensaje,
      });
      limpiarFormulario();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el cliente',
          text: error.mensaje,
      }); 
      });
    }
  }

  const limpiarFormulario = () => {
    setNombre("");
    setApellido("");
    setIdentificacion("");
    document.getElementById("miFormulario").reset();
  }

  return (
    <div id="regTipo" style={{ textAlign: 'left', marginRight: '10px', marginLeft: '10px' }}>
    <Typography variant="h6" style={{ marginTop: 50, textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a" }}>
      FORMULARIO DE REGISTRO DE CLIENTES
    </Typography>
    <form id="miFormulario" onSubmit={botonGuardarCliente} style={{ backgroundColor: "#03112a" }}>
      <Grid container spacing={2} >
        <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
            label="Nombre del cliente"
            variant="outlined"
            fullWidth
            size="large"
            type='text'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            InputProps={{
              sx: { color: '#eeca06' },
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAddAlt sx={{ color: '#eeca06' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: { color: '#eeca06' } }} />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
            label="Apellido del cliente"
            variant="outlined"
            fullWidth
            size="large"
            type='text'
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
            InputProps={{
              sx: { color: '#eeca06' },
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAddAlt sx={{ color: '#eeca06' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: { color: '#eeca06' } }} />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
            label="CI, NIT, CEX del cliente"
            variant="outlined"
            fullWidth
            size="large"
            type='number'
            value={nit_ci_cex}
            onChange={(e) => setIdentificacion(e.target.value)}
            required
            InputProps={{
              sx: { color: '#eeca06' },
              startAdornment: (
                <InputAdornment position="start">
                  <Badge sx={{ color: '#eeca06' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: { color: '#eeca06' } }} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <Button variant="contained" color="primary" size="large" type="submit" sx={{ backgroundColor: '#eeca06', color: '#03112a' }}>
            Guardar al cliente
          </Button>
        </Box>
      </Grid>
    </form>
  </div>
  );
};
