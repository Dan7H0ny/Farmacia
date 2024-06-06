import React, {useState, useEffect} from 'react';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box , Grid, InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ProductionQuantityLimits, DateRange, Description, AddBusiness, AttachMoney} from '@mui/icons-material';

export const RegistrarProducto = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [proveedor, setProveedor] = useState([]);
  const [id_proveedor, setIdProveedor] = useState('');
  const [capacidad_caja, setCapacidadP] = useState('');
  const [precio_por_menor, setPrecioMenor] = useState('');
  const [precio_por_mayor, setPrecioMayor] = useState('');
  const usuario = localStorage.getItem('id');
  const [fecha_caducidad, setFechaCaducidad] = useState('');
  const [fecha_registro_, setFechaRegistro] = useState('');
  const [fecha_actualizacion_, setFechaActualizacion] = useState('');
  
  const navigate = useNavigate();
  const obtenerToken = () => {
    // Obtener el token del local storage
    const token = localStorage.getItem('token');
    return token;
  };
  const token = obtenerToken();
  const configInicial = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const categorias = [
    { nombre: 'Tabletas' },
    { nombre: 'Jarabe' },
    { nombre: 'Sueros' },
    { nombre: 'Dentifricos' },
    { nombre: 'Supositorios' },
    { nombre: 'Suplementos' },
  ];
  useEffect(() => {
    // Obtener la fecha actual en la zona horaria local
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setFechaRegistro(formattedDate);
    setFechaActualizacion(formattedDate);
  }, []);

  useEffect(() => {
    const token = obtenerToken();
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "Error al obtener el token de acceso",
      });
      navigate('/Menu/Administrador')
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.get('http://localhost:4000/proveedor/mostrar', config)
      .then(response => {
        setProveedor(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los proveedores',
          text: error.response ? error.response.data.mensaje : 'Error desconocido',
        });
        navigate('/Menu/Administrador')
      });
      
  }, [navigate]);

  const CrearProducto = (e) => {
    e.preventDefault();
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador');
      return;
    }
    else{
      const data = { nombre, descripcion, categoria, proveedor: id_proveedor, capacidad_caja, capacidad_unitaria: 0, precio_por_menor, 
      precio_por_mayor, usuario, fecha_caducidad, fecha_registro: fecha_registro_, fecha_actualizacion: fecha_actualizacion_ };
    
      axios.post('http://localhost:4000/producto/crear', data, configInicial)
        .then(response => {
          Swal.fire({
              icon: 'success',
              title: 'Producto Creado',
              text: response.mensaje,
          });
          limpiarFormulario()
        })
        .catch(error => {
          Swal.fire({
              icon: 'error',
              title: 'Error al crear el producto',
              text: error.mensaje,
          });
        });
    }
  };
  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setCategoria("");
    setCapacidadP("");
    setPrecioMenor("");
    setPrecioMayor("");
    setIdProveedor("");
    setFechaCaducidad("");
    document.getElementById("Form-1").reset();
  }

  return (
    <div id="UsuarioReg" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px' }}>
      <Typography variant="h6" style={{ marginTop: 0, textAlign: 'center',fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a"}}>
        FORMULARIO DE REGISTRO DEL PRODUCTO
      </Typography>
      <Box mt={2} sx={{backgroundColor: "#03112a"}}>
        <form id="Form-1" onSubmit={CrearProducto}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4.5} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Ingrese el nombre del producto"
              value={nombre}
              type='text'
              onChange={(e) => setNombre(e.target.value)}
              required
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <ProductionQuantityLimits sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
          </Grid>
          <Grid item xs={12} sm={4.5} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <FormControl fullWidth variant="outlined" sx={{ color: '#eeca06', backgroundColor:'#060e15'}}>
              <InputLabel id="rol-label" sx={{ color: '#eeca06' }}>Seleccione la categoria del producto</InputLabel>
                <Select
                  labelId="rol-label"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                  sx={{ color: '#eeca06' }}>
                    <MenuItem></MenuItem>
                      {categorias.map((c) => (
                        <MenuItem key={c.nombre} value={c.nombre}>
                          {c.nombre}
                        </MenuItem>
                      ))}  
                  </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Ingrese la fecha de caducidad del producto"
              value={fecha_caducidad}
              type='date'
              onChange={(e) => setFechaCaducidad(e.target.value)}
              required
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
          </Grid>
          <Grid item xs={12} sm={9} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Ingrese la descripcion del producto"
              value={descripcion}
              type='text'
              onChange={(e) => setDescripcion(e.target.value)}
              multiline
              rows={4} 
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Description sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Ingrese la capacidad total"
              value={capacidad_caja}
              type='number'
              onChange={(e) => setCapacidadP(e.target.value)}
              required
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <AddBusiness sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
              <Grid item xs={12} sm={12} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15', marginTop: 2 }}}>
              <TextField
                fullWidth
                variant="outlined"
                label="Ingrese el precio por menor del producto"
                value={precio_por_menor}
                type='number'
                onChange={(e) => setPrecioMenor(e.target.value)}
                required
                InputProps={{
                  sx: { color: '#eeca06' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: '#eeca06' }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ sx: { color: '#eeca06' } }} />
              </Grid>
          </Grid>
          <Grid item xs={12} sm={9} >
            <FormControl fullWidth variant="outlined"sx={{ color: '#eeca06',backgroundColor: '#060e15'}}>
              <InputLabel id="proveedor-label" sx={{ color: '#eeca06' }}>Seleccione un proveedor del producto</InputLabel>
                {proveedor.length > 0 && (
                <Select
                  labelId="proveedor-label"
                  value={id_proveedor}
                  onChange={(e) => setIdProveedor(e.target.value)}
                  required sx={{ color: '#eeca06' }}>
                  {proveedor.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.nombre_marca}
                    </MenuItem>
                    ))}
                </Select>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15'}} }>
            <TextField
              fullWidth
              variant="outlined"
              label="Ingrese el precio por mayor del producto"
              value={precio_por_mayor}
              type='number'
              onChange={(e) => setPrecioMayor(e.target.value)}
              required
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button variant="contained" color="primary" size="large" type="submit">
                AGREGAR UN PRODUCTO
              </Button>
            </Box>
          </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};



