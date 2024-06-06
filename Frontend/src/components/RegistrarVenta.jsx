import React, {useState, useEffect} from 'react';
import { Typography, TextField, Button, Box , Grid, InputAdornment, TableCell, TableHead, Table, TableRow, TableBody, TableContainer, Paper  } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {DateRange, AddCircleOutlineOutlined, RemoveCircleOutlineOutlined, Search, Tag } from '@mui/icons-material';

export const RegistrarVenta = () => {
  const location = useLocation();
  const ventaData = location.state?.ventaData;
  const [cliente, setCliente] = useState([]);
  const [id_cliente, setIdCliente] = useState('');
  const [ci_nit_cex, setCINITCEX] = useState('');
  const [producto, setProducto] = useState([]);
  const [id_producto, setIdProducto] = useState([]);
  const [productoAñadido, setProductoAñadido] = useState([]);
  const [nombre_producto, setNombreProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio_total, setPrecioTotal] = useState(0);
  const usuario_registra_ = localStorage.getItem('id');
  const usuario_update_ = localStorage.getItem('id');
  
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
    if (!ventaData) {
      console.log("no hay productos o datos anteriores")
    }
    else{
      const productosUpdate = ventaData.productos.map(item => ({
        nombre: item.producto.nombre,
        proveedor: item.producto.proveedor,
        cantidad: item.cantidad,
        precio_por_menor: item.producto.precio_por_menor,
        precio: item.precio,
        _id: item.producto._id,
      }));
      const prodocitoIds = ventaData.productos.map(item => ({
        producto: item.producto._id,
        cantidad: item.cantidad,
        precio: item.precio,
      }));
      setIdCliente(ventaData.cliente)
      setProductoAñadido(productosUpdate)
      setPrecioTotal(ventaData.precio_total)
      setIdProducto(prodocitoIds)
    }
  }, [ventaData, navigate]);

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
    axios.get('http://localhost:4000/producto/mostrar', config)
      .then(response => {
        setProducto(response);
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
    axios.get('http://localhost:4000/cliente/mostrar', config)
      .then(response => {
        setCliente(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los clientes',
          text: error.response ? error.response.data.mensaje : 'Error desconocido',
        });
        navigate('/Menu/Administrador')
      });
  }, [navigate]);

  const crearVenta = (e) => {
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
    }else{
    const data = { cliente: id_cliente._id, productos: id_producto, precio_total, usuario_registra: usuario_registra_, usuario_update: usuario_update_ };
    console.log(id_producto)
    axios.post('http://localhost:4000/venta/crear', data, configInicial)
      .then(response => {
        Swal.fire({
            icon: 'success',
            title: 'Venta Creado',
            text: response.mensaje,
        });
        limpiarFormulario()
        setIdProducto([])
        setPrecioTotal(0)
      })
      .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error al crear la venta',
            text: error.mensaje,
        });
      });
    }
  };
  const editarVenta = (e) => {
    e.preventDefault();

    if (!ventaData) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'No se puede actualizar por que no hay datos anteriores por favor volver a la lista de clientes en el lado izquierdo y de click en actualizar una venta',
      });
      return; // Salir de la función si ventaData no está disponible
    }

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
    }else{
    const data = { cliente: id_cliente._id, productos: id_producto, precio_total, usuario_update: usuario_update_ };
    axios.put(`http://localhost:4000/venta/actualizar/${ventaData._id}`, data, configInicial)
      .then(response => {
        Swal.fire({
            icon: 'success',
            title: 'Venta Actualizada',
            text: response.mensaje,
        });
        navigate('/Menu/Administrador/Venta/Listar')
      })
      .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error al editar la venta',
            text:  error.mensaje,
        });
      });
    }
  };
  const botonBuscarCliente = () => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`http://localhost:4000/cliente/buscarci/${ci_nit_cex}`, configInicial)
      .then(response => {
        setCliente(response);
        setCINITCEX("");
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al buscar al cliente',
          text: error.mensaje,
        });
      });
    }
  };
  const botonAgregarCliente = (cliente) => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
      if (!token) {
        // Redirigir al login si el token no existe
        Swal.fire({
          icon: 'error',
          title: 'El token es invalido',
          text: "error",
        });
        navigate('/Menu/Administrador')
      }
      else{
    const clienteActual = cliente;
    axios.get(`http://localhost:4000/cliente/buscar/${clienteActual._id}`, configInicial)
      .then(response => {
        setIdCliente(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al buscar al cliente',
          text: error.mensaje,
        });
      });
  };
  }
  const botonBuscarProducto = () => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`http://localhost:4000/producto/buscarnombre/${nombre_producto}`, configInicial)
      .then(response => {
        setProducto(response);
        setNombreProducto("");
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al buscar el producto',
          text: error.mensaje,
        });
      });
    }
  };

  const botonAgregarProducto = (index) => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es inválido',
        text: "error",
      });
      navigate('/Menu/Administrador');
    } else {  
      const productoActual = producto[index];
      // Verificar si el producto ya está añadido
      const productoYaAñadido = productoAñadido.some(p => p._id === productoActual._id);
      if (productoYaAñadido) {
        Swal.fire({
          icon: 'warning',
          title: 'Producto ya añadido',
          text: 'Este producto ya está en el carrito',
        });
      } else {
        axios.get(`http://localhost:4000/producto/buscar/${productoActual._id}`, configInicial)
          .then(response => {
            const precioProducto = response.precio_por_menor * (cantidad[productoActual._id] || 1);
            const cantidadProducto = cantidad[productoActual._id] || 1;
            const productoConCantidad = { ...response, cantidad: cantidadProducto, precio: precioProducto};
            const idproductos_2 = { producto: response._id, cantidad: cantidadProducto, precio: precioProducto};
            setProductoAñadido(prevProductos => [...prevProductos, productoConCantidad]);
            setIdProducto(prevProductos => [...prevProductos, idproductos_2])
            const precioTotalActualizado = [...productoAñadido, productoConCantidad].reduce((total, producto) => total + producto.precio, 0);
            setPrecioTotal(precioTotalActualizado);
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error al buscar el producto',
              text: error.mensaje,
            });
          });
      }
      setCantidad("");
    }
  };
  const handleCantidadChange = (id, value) => {
    setCantidad(prev => ({ ...prev, [id]: value }));
  };
  const botonEliminarProducto = (index) => {
    setProductoAñadido(prevProductos => {
      const nuevosProductos = prevProductos.filter((_, i) => i !== index);
      // Recalcula el precio total después de eliminar un producto
      const precioTotalActualizado = nuevosProductos.reduce((total, producto) => total + producto.precio, 0);
      setPrecioTotal(precioTotalActualizado);
      return nuevosProductos;
    });
    setIdProducto(prevProductos => prevProductos.filter((_, i) => i !== index));
  };
  
  const limpiarFormulario = () => {
    setIdCliente("");
    setProductoAñadido([]);
  }
  return (
  <div id="caja_contenido" style={{ textAlign: 'left', marginRight: '0px', marginLeft: '0px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4.5}>
          <Typography variant="h6" style={{ marginTop: 10, textAlign: 'center', fontSize: '30px', color: '#eeca06', backgroundColor: "#03112a", padding: '10px' }}>
            LISTA DE CLIENTES
          </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Buscar el cliente por ci/nit/cex"
              value={ci_nit_cex}
              type='number'
              required
              onChange={(e) => setCINITCEX(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
                sx: { color: '#eeca06', backgroundColor: '#060e15' }
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" sx={{ backgroundColor: 'green', '&amp;:hover': { backgroundColor: 'darkgreen' } }} onClick={botonBuscarCliente}>
                Buscar
              </Button>
            </Box>
          <TableContainer component={Paper} style={{ maxHeight: '700px', marginTop: '10px' }}>
            <Table stickyHeader>
              <TableHead sx={{ '& .MuiTableCell-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>NOMBRE</TableCell>
                  <TableCell>APELLIDO</TableCell>
                  <TableCell>IDENTIFICACION CI/NIT/CEX</TableCell>
                  <TableCell>AGREGAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ '& .MuiTableCell-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
                {cliente._id && (
                  <TableRow >
                    <TableCell>{1}</TableCell>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.apellido}</TableCell>
                    <TableCell>{cliente.nit_ci_cex}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="contained" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }} onClick={() => botonAgregarCliente(cliente)}>
                        <AddCircleOutlineOutlined />
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={7.5}>
          <Typography variant="h6" style={{ marginTop: 10, textAlign: 'center', fontSize: '30px', color: '#eeca06', backgroundColor: "#03112a", padding: '10px' }}>
            LISTA DE PRODUCTOS
          </Typography>
          <TextField
              fullWidth
              variant="outlined"
              label="Buscar el nombre del producto"
              value={nombre_producto}
              type='text'
              required
              onChange={(e) => setNombreProducto(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
                sx: { color: '#eeca06', backgroundColor: '#060e15' }
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" sx={{ backgroundColor: 'green', '&amp;:hover': { backgroundColor: 'darkgreen' }, marginLeft: '10px' }} onClick={botonBuscarProducto}>
                Buscar
              </Button>
            </Box>
          <TableContainer component={Paper} style={{ maxHeight: '700px', marginTop: '10px' }}>
            <Table stickyHeader>
              <TableHead sx={{ '& .MuiTableCell-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>NOMBRE</TableCell>
                  <TableCell>CATEGORIA</TableCell>
                  <TableCell>PROVEEDOR</TableCell>
                  <TableCell>PRECIO</TableCell>
                  <TableCell>CANTIDAD</TableCell>
                  <TableCell>AGREGAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ '& .MuiTableCell-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
                {producto.map((x, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{x.nombre}</TableCell>
                    <TableCell>{x.categoria}</TableCell>
                    <TableCell>{x.proveedor.nombre_marca}</TableCell>
                    <TableCell>{x.precio_por_menor}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Añadir cantidad del producto que va a llevar"
                        value={cantidad[x._id] || ''}
                        type='number'
                        required
                        onChange={(e) => handleCantidadChange(x._id, e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Tag sx={{ color: '#eeca06' }} />
                            </InputAdornment>
                          ),
                          sx: { color: '#eeca06', backgroundColor: '#060e15', width: '200px', padding: '1px'}
                        }}
                        InputLabelProps={{ sx: { color: '#eeca06' } }} />
                      </TableCell>
                    <TableCell className="text-center">
                      <Button variant="contained" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }} onClick={() => botonAgregarProducto(index)}>
                        <AddCircleOutlineOutlined />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Box mt={2} sx={{ backgroundColor: "#03112a" }}>
        <form id="Form-3" onSubmit={crearVenta}>
          <Grid item xs={12} sm={12}>
            <Typography variant="h6" style={{ marginTop: 20, textAlign: 'center', fontSize: '30px', color: '#eeca06', backgroundColor: "#03112a", padding: '10px' }}>
              PRODUCTOS AÑADIDOS
            </Typography>
            <TableContainer component={Paper} style={{ maxHeight: '500px', marginTop: '10px' }}>
              <Table stickyHeader>
                <TableHead sx={{ '& .MuiTableCell-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>CLIENTE</TableCell>
                    <TableCell>PRODUCTO</TableCell>
                    <TableCell>PROVEEDOR</TableCell>
                    <TableCell>CANTIDAD</TableCell>
                    <TableCell>PRECIO</TableCell>
                    <TableCell>PRECIO TOTAL</TableCell>
                    <TableCell>ELIMINAR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ '& .MuiTableCell-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
                  {productoAñadido.map((x, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{id_cliente.nombre}, {id_cliente.apellido}, {id_cliente.nit_ci_cex} </TableCell>
                      <TableCell>{x.nombre}</TableCell>
                      <TableCell>{x.proveedor.nombre_marca}</TableCell>
                      <TableCell>{x.cantidad}</TableCell>
                      <TableCell>{x.precio_por_menor}</TableCell>
                      <TableCell>{x.precio}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="contained" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }} onClick={() => botonEliminarProducto(index)}>
                          <RemoveCircleOutlineOutlined />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15', marginTop: 5} }}>
              <TextField
                fullWidth
                variant="outlined"
                label="PRECIO TOTAL DE LA VENTA"
                value={precio_total}
                type='number'
                onChange={(e) => setPrecioTotal(e.target.value)}
                InputProps={{
                  readOnly: true,
                  sx: { color: '#eeca06' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange sx={{ color: '#eeca06' }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ sx: { color: '#eeca06' } }} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} >
              <Box display="flex" justifyContent="center">
                <Button variant="contained" color="primary" size="large" type="submit">
                  AGREGAR UNA VENTA
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" justifyContent="center">
                <Button variant="contained" color="primary" size="large" onClick={editarVenta}>
                  EDITAR UNA VENTA
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};



