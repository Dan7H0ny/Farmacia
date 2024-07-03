import React, { useState } from 'react'
import axios from 'axios';
import { TextField, Button ,Typography, InputAdornment, Grid, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {Person, Badge, Email, SupervisedUserCircle, PhoneAndroid } from '@mui/icons-material';

export const RegistrarCliente = ( ) => {

  const [ nombre, setNombre ] = useState('');
  const [ apellido, setApellido ] = useState('');
  const [ correo, setCorreo ] = useState('');
  const [ telefono, setTelefono ] = useState('');
  const [ sexo, setSexo ] = useState('');
  const [ nit_ci_cex, setIdentificacion ] = useState('');
  const [ envioIntentado, setEnvioIntentado ] = useState(false);
  const navigate = useNavigate();

  const generos = [
    { nombre: 'Masculino' },
    { nombre: 'Femenino' },
  ];

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
    const NewClient = { nombre, apellido, correo, telefono, sexo, nit_ci_cex };
    if (nit_ci_cex.length < 5 || nit_ci_cex.length > 12 ) {
      Swal.fire({
        icon: 'error',
        title: 'Número de teléfono inválido',
        text: 'El numero es menor a 5 digitos y es mayor a 12 digitos',
      });
      return;
    } 
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
    setCorreo("");
    setSexo("");
    setEnvioIntentado(false);
    document.getElementById("miFormulario").reset();
  }

  return (
    <div id="caja_contenido" style={{ textAlign: 'left', marginRight: '10px', marginLeft: '10px' }}>
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
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres no permitidos usando una expresión regular
                const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                setNombre(newValue);
            }}
            required
            InputProps={{
              sx: { color: '#eeca06' },
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#eeca06' }} />
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
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres no permitidos usando una expresión regular
              const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
              setApellido(newValue);
            }}
            required
            InputProps={{
              sx: { color: '#eeca06' },
              startAdornment: (
                <InputAdornment position="start">
                  <SupervisedUserCircle sx={{ color: '#eeca06' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: { color: '#eeca06' } }} />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
            label="Correo del cliente"
            variant="outlined"
            fullWidth
            size="large"
            type='email'
            value={correo}
            onChange={(e) => {setCorreo(e.target.value)}}
            InputProps={{
              sx: { color: '#eeca06' },
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#eeca06' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: { color: '#eeca06' } }} />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Ingrese el número del Cliente"
            value={telefono}
            type='number'
            onChange={(e) => {
              const inputValue = e.target.value;
              // Si la longitud del número es mayor a 8 dígitos, restringir el valor a los primeros 8 dígitos
              if (inputValue.length > 8) {
                setTelefono(inputValue.slice(0, 8));
              } else {
                setTelefono(inputValue);
              }
            }}
            error={envioIntentado && telefono && (telefono.length !== 8 || telefono < 60000000 || telefono > 79999999)}
            helperText={envioIntentado && telefono && (telefono.length !== 8 || telefono < 60000000 || telefono > 79999999) ? 'Número de teléfono inválido' : ''}
            InputProps={{
              sx: { color: '#eeca06' },
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroid sx={{ color: '#eeca06' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: { color: '#eeca06' } }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined" sx={{ color: '#eeca06', backgroundColor:'#060e15'}}>
            <InputLabel id="rol-label" sx={{ color: '#eeca06' }}>Seleccione el genero del cliente</InputLabel>
              <Select
                labelId="rol-label"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                required
                sx={{ color: '#eeca06' }}>
                <MenuItem></MenuItem>
                {generos.map((g) => (
                <MenuItem key={g.nombre} value={g.nombre}>
                  {g.nombre}
                </MenuItem>
              ))}  
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
            label="CI, NIT, CEX del cliente"
            variant="outlined"
            fullWidth
            size="large"
            type='number'
            value={nit_ci_cex}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Si la longitud del número no es exactamente 8 dígitos, restringir el valor a los primeros 8 dígitos
              if (inputValue.length > 12) {
                // Si es mayor, truncar el valor a la longitud máxima
                setIdentificacion(inputValue.slice(0, 12));
              }
              setIdentificacion(inputValue.slice(0, 12));
            }}
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
