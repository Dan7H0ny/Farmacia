import React, { useState } from 'react'
import axios from 'axios';
import { TextField, Button ,Typography, InputAdornment, Grid, Box } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {AddBusiness, Email, LocalPhone, Language, SupervisedUserCircle, PhoneAndroid} from '@mui/icons-material';

export const RegistrarProveedor = () => {
  const [nombre_marca, setNombreMarca] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sitioweb, setSitioWeb] = useState('');
  const [nombre_vendedor, setNombreVendedor] = useState('');
  const [correo_vendedor, setCorreoVendedor] = useState('');
  const [celular, setCelular] = useState('');
  const [ envioIntentado, setEnvioIntentado ] =useState(false);

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
    const miProveedor = { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular};
    setEnvioIntentado(true)
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
    setNombreVendedor("");
    setCorreoVendedor("");
    setCelular("");
    document.getElementById("miFormulario").reset();
  }
  return (
  <div id="caja_contenido" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px' }}>
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
              onChange={(e) => {
                const inputValue = e.target.value;
                // Si la longitud del número es mayor a 8 dígitos, restringir el valor a los primeros 8 dígitos
                if (inputValue.length > 8) {
                  setTelefono(inputValue.slice(0, 8));
                } else {
                  setTelefono(inputValue);
                }
              }}
              error={envioIntentado && telefono && (telefono.length !== 8 || telefono < 400000 || telefono > 79999999)}
              helperText={envioIntentado && telefono && (telefono.length !== 8 || telefono < 400000 || telefono > 79999999) ? 'Número de celular inválido' : ''}
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
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
            <TextField
              label="Nombre del vendedor del proveedor"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={nombre_vendedor}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres no permitidos usando una expresión regular
                const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                setNombreVendedor(newValue);
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
              label="Correo del vendedor del proveedor"
              variant="outlined"
              fullWidth
              size="large"
              type='email'
              value={correo_vendedor}
              onChange={(e) => {setCorreoVendedor(e.target.value)}}
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
              label="Ingrese el número del Proveedor"
              value={celular}
              type='number'
              onChange={(e) => {
                const inputValue = e.target.value;
                // Si la longitud del número es mayor a 8 dígitos, restringir el valor a los primeros 8 dígitos
                if (inputValue.length > 8) {
                  setCelular(inputValue.slice(0, 8));
                } else {
                  setCelular(inputValue);
                }
              }}
              error={envioIntentado && celular && (celular.length !== 8 || celular < 60000000 || celular > 79999999)}
              helperText={envioIntentado && celular && (celular.length !== 8 || celular < 60000000 || celular > 79999999) ? 'Número de celular inválido' : ''}
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
