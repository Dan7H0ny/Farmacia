import React, {useState, useEffect} from 'react';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box , Grid, InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ProductionQuantityLimits, DateRange, Description, AddBusiness, AttachMoney, Inventory} from '@mui/icons-material';

export const RegistrarProducto = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState([]);
  const [id_categoria, setIdCategoria] = useState('');
  const [tipo, setTipo] = useState([]);
  const [id_tipo, setIdTipo] = useState('');
  const [proveedor, setProveedor] = useState([]);
  const [id_proveedor, setIdProveedor] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [capacidad_pres, setCapacidadPres] = useState('');
  const [precio, setPrecio] = useState('');
  const usuario = localStorage.getItem('id');
  const [fecha_caducidad, setFechaCaducidad] = useState('');
  
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
          text: error.response ? error.response.mensaje : 'Error desconocido',
        });
        navigate('/Menu/Administrador')
      });
      
  }, [navigate]);

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
    axios.get('http://localhost:4000/categoria/mostrar', config)
      .then(response => {
        setCategoria(response);
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
    axios.get('http://localhost:4000/tipo/mostrar', config)
      .then(response => {
        setTipo(response);
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
      const data = { nombre, descripcion, id_categoria, id_tipo, id_proveedor, cantidad, capacidad, capacidad_pres, precio, usuario, 
        fecha_caducidad };
    
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
    setCantidad("");
    setCapacidad("");
    setCapacidadPres("");
    setPrecio("");
    setFechaCaducidad("");
    setIdCategoria("");
    setIdProveedor("");
    setIdTipo("");
    document.getElementById("Form-1").reset();
  }

  return (
    <div id="caja_contenido" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px' }}>
      <Typography variant="h6" style={{ marginTop: 0, textAlign: 'center',fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a"}}>
        FORMULARIO DE REGISTRO DEL PRODUCTO
      </Typography>
      <Box mt={2} sx={{backgroundColor: "#03112a"}}>
        <form id="Form-1" onSubmit={CrearProducto}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7.5} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
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
          <Grid item xs={12} sm={7.5} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
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
          <Grid item xs={12} sm={4.5} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Ingrese la capacidad de presentacion"
              value={capacidad_pres}
              type='number'
              onChange={(e) => setCapacidadPres(e.target.value)}
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
                label="Ingrese la cantidad de la capacidad de presentacion"
                value={cantidad}
                type='number'
                onChange={(e) => setCantidad(e.target.value)}
                required
                InputProps={{
                  sx: { color: '#eeca06' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory sx={{ color: '#eeca06' }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ sx: { color: '#eeca06' } }} />
              </Grid>
          </Grid>
          <Grid item xs={12} sm={7.5} >
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
          <Grid item xs={12} sm={4.5} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15'}} }>
            <TextField
              fullWidth
              variant="outlined"
              label="Ingrese el precio del producto"
              value={precio}
              type='number'
              onChange={(e) => setPrecio(e.target.value)}
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
          <Grid item xs={12} sm={3.75} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <FormControl fullWidth variant="outlined" sx={{ color: '#eeca06', backgroundColor:'#060e15'}}>
              <InputLabel id="categoria-label" sx={{ color: '#eeca06' }}>Seleccione la categoria del producto</InputLabel>
                <Select
                  labelId="categoria-label"
                  value={id_categoria}
                  onChange={(e) => setIdCategoria(e.target.value)}
                  required
                  sx={{ color: '#eeca06' }}>
                    <MenuItem></MenuItem>
                      {categoria.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.nombre}
                        </MenuItem>
                      ))}  
                  </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3.75} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15' }}}>
            <FormControl fullWidth variant="outlined" sx={{ color: '#eeca06', backgroundColor:'#060e15'}}>
              <InputLabel id="tipo-label" sx={{ color: '#eeca06' }}>Seleccione la categoria del producto</InputLabel>
                <Select
                  labelId="tipo-label"
                  value={id_tipo}
                  onChange={(e) => setIdTipo(e.target.value)}
                  required
                  sx={{ color: '#eeca06' }}>
                    <MenuItem></MenuItem>
                      {tipo.map((t) => (
                        <MenuItem key={t._id} value={t._id}>
                          {t.nombreTipo}
                        </MenuItem>
                      ))}  
                  </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4.5} sx={{ '& .MuiTextField-root': {backgroundColor: '#060e15'}} }>
            <TextField
              fullWidth
              variant="outlined"
              label="Ingrese la capacidad del Stock"
              value={capacidad}
              type='number'
              onChange={(e) => setCapacidad(e.target.value)}
              required
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Inventory sx={{ color: '#eeca06' }} />
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



