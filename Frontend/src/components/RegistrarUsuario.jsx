import React from 'react';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box , Grid, InputAdornment   } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Password, Email, PhoneAndroid, Person, SupervisedUserCircle, Room } from '@mui/icons-material';
import '../assets/css/menu.css';

export const RegistrarUsuario = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = React.useState('');
  const [apellido, setApellido] = React.useState('');
  const [rol, setRol] = React.useState('');
  const [direccion, setDireccion] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [correo, setCorreo] = React.useState('');
  const [password, setPassword] = React.useState('');

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

  const roles = [
    { nombre: 'Administrador' },
    { nombre: 'Cajero' },
  ];
  const RegistrarUsuario = (e) => {
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
    const Usuario = { nombre, apellido, rol, direccion, telefono, correo, password };
    Usuario.telefono = parseInt(Usuario.telefono);
    axios.post('http://localhost:4000/usuario/crear', Usuario, config)
      .then(response => {
        Swal.fire({
            icon: 'success',
            title: 'Usuario Creado',
            text: response.mensaje,
        });
        limpiarFormulario();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el usuario',
          text: error.mensaje, // Acceder al mensaje de error
        });
      });
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setApellido("");
    setRol("");
    setDireccion("");
    setTelefono("");
    setCorreo("");
    setPassword("");
    document.getElementById("Form-1").reset();
  }
  return (
    <div id="caja_contenido" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px'}}>
        <Typography variant="h6" style={{ marginTop: 25, textAlign: 'center',fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a"}}>
            FORMULARIO DE REGISTRO DE USUARIOS
        </Typography>
        <Box mt={3} sx={{backgroundColor: "#03112a"}}>
          <form id="Form-1" onSubmit={RegistrarUsuario} >
            <Grid container spacing={3} >
              <Grid item xs={12} sm={3} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Ingresar el/los nombre/s del usuario"
                  type='text'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
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
              <Grid item xs={12} sm={3} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Ingresar el/los apellido/s del usuario"
                  type='text'
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
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
              <Grid item xs={12} sm={6} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Ingrese la direccion del Usuario"
                  value={direccion}
                  type='text'
                  onChange={(e) => setDireccion(e.target.value)}
                  InputProps={{
                    sx: { color: '#eeca06' },
                      startAdornment: (
                        <InputAdornment position="start">
                          <Room sx={{ color: '#eeca06' }} />
                        </InputAdornment>
                      ),
                    }}
                  InputLabelProps={{ sx: { color: '#eeca06' } }} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth variant="outlined" sx={{ color: '#eeca06', backgroundColor:'#060e15'}}>
                  <InputLabel id="rol-label" sx={{ color: '#eeca06' }}>Seleccione un rol para el usuario</InputLabel>
                    <Select
                      labelId="rol-label"
                      value={rol}
                      onChange={(e) => setRol(e.target.value)}
                      required
                      sx={{ color: '#eeca06' }}>
                      <MenuItem></MenuItem>
                        {roles.map((rol) => (
                          <MenuItem key={rol.nombre} value={rol.nombre}>
                            {rol.nombre}
                          </MenuItem>
                        ))}  
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Ingrese el número del Usuario"
                            value={telefono}
                            type='number'
                            onChange={(e) => setTelefono(e.target.value)}
                            required
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
                    <Grid item xs={12} sm={3} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Ingrese el correo del Usuario"
                            type='email'
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
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
                    </Grid>
                    <Grid item xs={12} sm={3} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Ingrese el password del Usuario"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                sx: { color: '#eeca06' },
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Password sx={{ color: '#eeca06' }} />
                                  </InputAdornment>
                                ),
                              }}
                            InputLabelProps={{ sx: { color: '#eeca06' } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center">
                            <Button variant="contained" color="primary" size="large" type="submit" sx={{ backgroundColor: '#eeca06', color: '#03112a' }}>
                                Guardar Usuario
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    </div>
  );
};



