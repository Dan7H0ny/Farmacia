import React, {useState, useEffect} from 'react';
import { Typography, TextField, Button, Box , Grid, InputAdornment, TableCell, TableHead, Table, TableRow, TableBody, TableContainer, Paper, TablePagination  } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {DateRange, AddCircleOutlineOutlined, RemoveCircleOutlineOutlined, Search, Tag } from '@mui/icons-material';

export const RegistrarVenta = () => {
  const location = useLocation();
  const ventaData = location.state?.ventaData;
  const [clientes, setClientes] = useState([]);
  const [id_cliente, setIdCliente] = useState('');
  const [productos, setProductos] = useState([]);
  const [id_producto, setIdProducto] = useState([]);
  const [productoAñadido, setProductoAñadido] = useState([]);
  const [cantidad, setCantidad] = useState('');
  const [precio_total, setPrecioTotal] = useState(0);
  const usuario_registra_ = localStorage.getItem('id');
  const usuario_update_ = localStorage.getItem('id');

  const [buscar, setBuscar] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [buscarProducto, setBuscarProducto] = useState('');
  const [currentProducto, setCurrentProducto] = useState(0);
  const [rowsPerProducto, setRowsPerProducto] = useState(5);
  
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
        cantidad_producto: item.cantidad_producto,
        precio: item.producto.precio,
        precio_producto: item.precio_producto,
        _id: item.producto._id,
      }));
      const prodocitoIds = ventaData.productos.map(item => ({
        producto: item.producto._id,
        cantidad_producto: item.cantidad_producto,
        precio_producto: item.precio_producto,
      }));
      setIdCliente(ventaData.cliente)
      setProductoAñadido(productosUpdate)
      setPrecioTotal(ventaData.precio_total)
      setIdProducto(prodocitoIds)
      console.log(productosUpdate)
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
        setProductos(response);
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
        setClientes(response);
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
    axios.get(`http://localhost:4000/cliente/buscar/${cliente._id}`, configInicial)
      .then(response => {
        setIdCliente(response);
        Swal.fire({
          icon: 'success',
          title: 'Cliente Agregado',
          text: 'El siguiente cliente ha sido agregado al carrito: ' + cliente.nombre + '  ' + cliente.apellido,
        });
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

  const botonAgregarProducto = (producto) => {
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
      console.log(producto)
      // Verificar si el producto ya está añadido
      const productoYaAñadido = productoAñadido.some(p => p._id === producto._id);
      if (productoYaAñadido) {
        Swal.fire({
          icon: 'warning',
          title: 'Producto ya añadido',
          text: 'Este producto ya está en el carrito',
        });
      } else {
        axios.get(`http://localhost:4000/producto/buscar/${producto._id}`, configInicial)
          .then(response => {
            const precioProducto = response.precio * (cantidad[producto._id] || 1);
            const cantidadProducto = cantidad[producto._id] || 1;
            const productoConCantidad = { ...response, cantidad_producto: cantidadProducto, precio_producto: precioProducto};
            const idproductos_2 = { producto: response._id, cantidad_producto: cantidadProducto, precio_producto: precioProducto};
            setProductoAñadido(prevProductos => [...prevProductos, productoConCantidad]);
            setIdProducto(prevProductos => [...prevProductos, idproductos_2])
            const precioTotalActualizado = [...productoAñadido, productoConCantidad].reduce((total, producto) => total + producto.precio_producto, 0);
            setPrecioTotal(precioTotalActualizado);
            console.log(productoAñadido)
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
      const precioTotalActualizado = nuevosProductos.reduce((total, producto) => total + producto.precio_producto, 0);
      setPrecioTotal(precioTotalActualizado);
      return nuevosProductos;
    });
    setIdProducto(prevProductos => prevProductos.filter((_, i) => i !== index));
  };
  
  const limpiarFormulario = () => {
    setIdCliente("");
    setProductoAñadido([]);
  }

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(buscar.toLowerCase())
  );  

  const paginatedClientes = filteredClientes.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  const handleChangeProducto = (event, newPage) => {
    setCurrentProducto(newPage);
  };

  const handleChangeRowsPerProducto = (event) => {
    setRowsPerProducto(parseInt(event.target.value, 10));
    setCurrentProducto(0);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(buscarProducto.toLowerCase())
  );  

  const paginatedProductos = filteredProductos.slice(currentProducto * rowsPerProducto, currentProducto * rowsPerProducto + rowsPerProducto);

  return (
  <div id="caja_contenido" style={{ textAlign: 'left', marginRight: '2%', marginLeft: '2%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" style={{ marginTop: 10, textAlign: 'center', fontSize: '30px', color: '#eeca06', backgroundColor: "#03112a", padding: '10px' }}>
            LISTA DE CLIENTES
          </Typography>
          <Grid item xs={12} sm={12} sx={{marginTop: 2, '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
            <TextField
              label="Nombre del cliente"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              required
              InputProps={{
              sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                  ),
                }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
          </Grid>
          <TableContainer component={Paper} style={{ maxHeight: '100%', marginTop: '10px' }}>
            <Table stickyHeader>
              <TableHead sx={{ '& .MuiTableCell-root': { color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>Identificacion</TableCell>
                  <TableCell>Agregar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
                {paginatedClientes.map((x, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                    <TableCell>{x.nombre} {x.apellido}</TableCell>
                    <TableCell>{x.nit_ci_cex}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="contained" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }} onClick={() => botonAgregarCliente(x)}>
                        <AddCircleOutlineOutlined />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredClientes.length}
              page={currentPage}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por por pagina"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              rowsPerPageOptions={[5, 10, 15, 20]}
              sx={{ 
                '& .MuiTablePagination-toolbar': {
                  backgroundColor: "#03112a",
                  color: '#eeca06',
                  display: 'flex',
                  justifyContent: 'center', // Centra el contenido dentro de la toolbar
                },
                '& .MuiTablePagination-selectLabel': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-input': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-selectIcon': {
                  color: '#eeca06',
                },
                '& .MuiTablePagination-displayedRows': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-actions': {
                  color: '#eeca06',
                }
              }}
            />
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" style={{ marginTop: 10, textAlign: 'center', fontSize: '30px', color: '#eeca06', backgroundColor: "#03112a", padding: '10px' }}>
            LISTA DE PRODUCTOS
          </Typography>
          <Grid item xs={12} sm={12} sx={{marginTop: 2, '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
            <TextField
              label="Nombre del producto"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={buscarProducto}
              onChange={(e) => setBuscarProducto(e.target.value)}
              required
              InputProps={{
              sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                  ),
                }}
              InputLabelProps={{ sx: { color: '#eeca06' } }} />
          </Grid>
          <TableContainer component={Paper} style={{ maxHeight: '100%', marginTop: '10px' }}>
            <Table stickyHeader>
              <TableHead sx={{ '& .MuiTableCell-root': { color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>NOMBRE</TableCell>
                  <TableCell>PROVEEDOR</TableCell>
                  <TableCell>PRECIO</TableCell>
                  <TableCell>CANTIDAD</TableCell>
                  <TableCell>AGREGAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
                {paginatedProductos.map((x, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                    <TableCell>{x.nombre}</TableCell>
                    <TableCell>{x.proveedor.nombre_marca}</TableCell>
                    <TableCell>{x.precio}</TableCell>
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
                      <Button variant="contained" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }} onClick={() => botonAgregarProducto(x)}>
                        <AddCircleOutlineOutlined />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredProductos.length}
              page={currentProducto}
              onPageChange={handleChangeProducto}
              rowsPerPage={rowsPerProducto}
              onRowsPerPageChange={handleChangeRowsPerProducto}
              labelRowsPerPage="Filas por por pagina"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              rowsPerPageOptions={[5, 10, 15, 20]}
              sx={{ 
                '& .MuiTablePagination-toolbar': {
                  backgroundColor: "#03112a",
                  color: '#eeca06',
                  display: 'flex',
                  justifyContent: 'center', // Centra el contenido dentro de la toolbar
                },
                '& .MuiTablePagination-selectLabel': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-input': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-selectIcon': {
                  color: '#eeca06',
                },
                '& .MuiTablePagination-displayedRows': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-actions': {
                  color: '#eeca06',
                }
              }}
            />

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
                      <TableCell>{x.cantidad_producto}</TableCell>
                      <TableCell>{x.precio_producto}</TableCell>
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



