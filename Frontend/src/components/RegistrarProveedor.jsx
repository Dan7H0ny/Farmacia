import React, { useState } from 'react'
import axios from 'axios';
import { TextField, Button ,Typography, InputAdornment, Grid, Box } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {AddBusiness, Email, LocalPhone, Language } from '@mui/icons-material';

export const RegistrarProveedor = () => {
  const [nombre_marca, setNombreMarca] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sitioweb, setSitioWeb] = useState('');
  const navigate = useNavigate();
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

  const botonGuardarTipo = (e) => {
    e.preventDefault();
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador')
      return;
    }
    else
    {
    const miProveedor = { nombre_marca, correo, telefono, sitioweb};
    axios.post('http://localhost:4000/proveedor/crear', miProveedor, config)
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Proveedor Creado',
          text: response.mensaje,
      });
      limpiarFormulario();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el proveedor',
          text: error.mensaje,
      }); 
      });
    }
  }

  const limpiarFormulario = () => {
    setNombreMarca("");
    setCorreo("");
    setTelefono("");
    setSitioWeb("");
    document.getElementById("miFormulario").reset();
  }
  return (
  <div id="regTipo" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px' }}>
    <Typography variant="h6" style={{ marginTop: 50, textAlign: 'center',fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a"}}>
        FORMULARIO DEL REGISTRO DE PROVEEDORES
    </Typography>
      <form id="miFormulario" onSubmit={botonGuardarTipo} style={{backgroundColor: "#03112a"}}>
        <Grid container spacing={2} >
          <Grid item xs={12} sm={6} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              label="Marca del proveedor"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={nombre_marca}
              onChange={(e) => setNombreMarca(e.target.value)}
              required
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <AddBusiness sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              label="correo del proveedor"
              variant="outlined"
              fullWidth
              size="large"
              value={correo}
              type='email'
              onChange={(e) => setCorreo(e.target.value)}
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
          </Grid>
          <Grid item xs={12} sm={6} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              label="telefono del proveedor"
              variant="outlined"
              fullWidth
              size="large"
              value={telefono}
              type='number'
              onChange={(e) => setTelefono(e.target.value)}
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalPhone sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              label="Sitio Web del proveedor"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={sitioweb}
              onChange={(e) => setSitioWeb(e.target.value)}
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Language sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" size="large" type="submit" sx={{ backgroundColor: '#eeca06', color: '#03112a' }}>
              Guardar al Proveedor
            </Button>
          </Box>
        </Grid>
      </form>
    </div>
  )
}
