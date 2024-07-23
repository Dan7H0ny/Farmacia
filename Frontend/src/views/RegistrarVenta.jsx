import React, { useState, useEffect } from 'react';
import { Typography, TextField, Autocomplete, Box, Table, TableHead, TableBody, TableRow, TableCell, Grid, TablePagination, Button } from '@mui/material';
import { AttachMoney, TagSharp } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token; };
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` } };

export const RegistrarVenta = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [idcliente, setIdCliente] = useState(null);
  const [inputCliente, setInputCliente] = useState('');  
  const [inputValue, setInputValue] = useState('');
  const [productosAñadidos, setProductosAñadidos] = useState([]);
  const [productosElegidos, setProductosElegidos] = useState([]);
  const usuario_ = localStorage.getItem('id');
  const navigate = useNavigate();
  const [reloadProductos, setReloadProductos] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [cantidad, setCantidad] = useState({});
  const [precioTotal, setPrecioTotal] = useState(0);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleCantidadChange = (id, value) => {
    const cantidadValue = parseInt(value, 10);
    const producto = productosAñadidos.find(p => p._id === id);

    if (producto) {
      const minCantidad = 1;
      const maxCantidad = producto.cantidad_stock;

      if (cantidadValue < minCantidad || cantidadValue > maxCantidad || isNaN(cantidadValue)) {
        CustomSwal({
          icono: 'error',
          titulo: 'Cantidad no válida',
          mensaje: `La cantidad debe estar entre ${minCantidad} y ${maxCantidad}.`
        });
      } else {
        setCantidad(prev => ({
          ...prev,
          [id]: cantidadValue
        }));
      }
    }
  };

  useEffect(() => {
    // Actualizar productosElegidos basándonos en la cantidad actualizada
    const updatedProductosElegidos = productosAñadidos.map(producto => ({
      producto: producto._id,
      nombre: producto.producto.nombre,
      tipo: producto.producto.tipo.nombre,
      proveedor: producto.producto.proveedor.nombre,
      categoria: producto.categoria.nombre,
      cantidad_producto: cantidad[producto._id] || 1,
      precio_venta: producto.precioVenta,

    }));

    setProductosElegidos(updatedProductosElegidos);
  }, [cantidad, productosAñadidos]);

  useEffect(() => {
    // Calcular el precio total basado en los productos y cantidades
    const total = productosAñadidos.reduce((acc, producto) => {
      const cant = cantidad[producto._id] || 1; // Valor por defecto 1
      return acc + (cant * producto.precioVenta);
    }, 0);
    setPrecioTotal(total);
  }, [cantidad, productosAñadidos]);

  const createTransposedData = () => {
    const headers = ["Producto", "Categoria", "Stock", "Fecha Caducidad", "Precio", "Añadir"];
    const paginatedProductos = productosAñadidos.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
    const transposedData = headers.map((header) => [
      header,
      ...paginatedProductos.map(row => {
        switch (header) {
          case "Producto":
            return row.producto.nombre;
          case "Categoria":
            return row.categoria.nombre;
          case "Stock":
            return row.cantidad_stock;
          case "Fecha Caducidad":
            return new Date(row.fecha_caducidad).toISOString().split('T')[0];
          case "Precio":
            return row.precioVenta;
          case "Añadir":
            return (
              <CustomRegisterUser
                number={12}
                label="Cantidad"
                placeholder='Ingrese la cantidad requerida'
                type='number'
                value={cantidad[row._id] || 1}
                onChange={(e) => handleCantidadChange(row._id, e.target.value)}
                required={true}
                maxValue={row.cantidad_stock}
                minValue={1}
                icon={<TagSharp />}
              />
            );
          default:
            return null;
        }
      })
    ]);
    return transposedData;
  };

  const transposedData = createTransposedData();

  useEffect(() => {
    axios.get(`${UrlReact}/almacen/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
          navigate('/Menu/Administrador');
        } else {
          const productosFiltrados = response.filter(producto => producto.estado === true);
          setProductos(productosFiltrados);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate, reloadProductos]);

  useEffect(() => {
    axios.get(`${UrlReact}/cliente/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
          navigate('/Menu/Administrador');
        } else {
          setClientes(response); 
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate]);

  const btnRegistrarVenta= (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    } 
    else 
    {
      const miventa = { 
        cliente:idcliente, 
        productos: productosElegidos, 
        precio_total:precioTotal, 
        usuario:usuario_
      };
      axios.post(`${UrlReact}/venta/crear`, miventa, configInicial)
        .then(response => {
          CustomSwal({ icono: 'success', titulo: 'Venta Creado', mensaje: response.mensaje});
          limpiarFormulario();
          setReloadProductos(prev => !prev);
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'Error al crear la venta', mensaje: error.mensaje});
        });
    }
  }

  const limpiarFormulario = () => {
    setIdCliente(null);
    setProductosAñadidos([]);
    setProductosElegidos([]);
    setInputValue("");
    setInputCliente("");
    setPrecioTotal(0);
    setProductos([]);
  }

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registrar una venta'} />
        <form id="Form-1" onSubmit={btnRegistrarVenta} className="custom-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={clientes}
              getOptionLabel={(option) => option.nombreCompleto + ' ' + option.numberIdentity }
              value={idcliente}
              onChange={(event, newValue) => {
                setIdCliente(newValue);
              }}
              inputValue={inputCliente}
              onInputChange={(event, newInputValue) => {
                setInputCliente(newInputValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Elija al cliente" variant="outlined" fullWidth 
                InputProps={{
                  ...params.InputProps,
                  sx: { backgroundColor: '#e2e2e2', color: '#0f1b35' } // Cambia el color de fondo y del texto aquí
                }}
                sx={{
                  backgroundColor: '#0f1b35', // Cambia el color de fondo del TextField aquí
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#0f1b35', // Cambia el color del borde aquí
                    },
                    '&:hover fieldset': {
                      borderColor: '#0f1b35', // Cambia el color del borde al pasar el ratón aquí
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#0095b0',
                    backgroundColor: '#e2e2e2',
                    paddingLeft: 5,
                    paddingRight: 5,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0095b0',
                    backgroundColor: '#e2e2e2',
                    paddingLeft: 5,
                    paddingRight: 5,
                    fontSize: '25px',
                  },
                }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  <Grid container alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="body1" component="span" sx={{ color: 'primary.main' }}>
                        {option.nombreCompleto}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="span">
                        {` - ${option.nombreCompleto} - ${option.numberIdentity} - ${option.stringIdentity.nombre}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Autocomplete
              multiple
              options={productos}
              getOptionLabel={(option) => option.producto.nombre || ''}
              value={productosAñadidos}
              onChange={(event, newValue) => {
                setProductosAñadidos(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccione los productos requeridos"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    sx: { backgroundColor: '#e2e2e2', color: '#0f1b35' } // Cambia el color de fondo y del texto aquí
                  }}
                  sx={{
                    backgroundColor: '#0f1b35', // Cambia el color de fondo del TextField aquí
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#0f1b35', // Cambia el color del borde aquí
                      },
                    '&:hover fieldset': {
                        borderColor: '#0f1b35', // Cambia el color del borde al pasar el ratón aquí
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0095b0',
                      backgroundColor: '#e2e2e2',
                      paddingLeft: 5,
                      paddingRight: 5,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#0095b0',
                      backgroundColor: '#e2e2e2',
                      paddingLeft: 5,
                      paddingRight: 5,
                      fontSize: '25px',
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  <Grid container alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="body1" component="span" sx={{ color: 'primary.main' }}>
                        {option.producto.nombre}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="span">
                        {` - ${option.categoria.nombre} - ${option.cantidad_stock} - ${new Date(option.fecha_caducidad).toISOString().split('T')[0]} - ${option.precioVenta}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{backgroundColor: '#e2e2e2', marginTop:2, borderRadius:5}}>
              {idcliente && (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2" align="center" sx={{color: '#0095b0'}}>
                    <strong>DATOS DEL CLIENTE:</strong>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} align="center" sx={{color: 'red',}}>
                      <strong>Nombre completo:</strong>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Typography sx={{color: '#0f1b35'}}>{idcliente.nombreCompleto}</Typography>
                    </Grid>
                    <Grid item xs={12} align="center" sx={{color: 'red',}}>
                      <strong>{idcliente.stringIdentity.nombre + ': '}</strong>
                    </Grid>
                    <Grid item xs={12} align="center">
                      <Typography sx={{color: '#0f1b35'}}>{idcliente.numberIdentity}</Typography>
                    </Grid>
                  </Grid> 
                </Grid>
              </Grid>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box>
              {productosAñadidos && (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                <Box sx={{ overflowX: 'auto', width: '100%' }}>
                  <Table className="table table-bordered" style={{ marginTop: '1.5%', border: '2px solid #e2e2e2' }}>
                    <TableHead className="text-center" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', fontWeight: 'bold', border: '2px solid #e2e2e2' } }}>
                      <TableRow>
                        <TableCell>#</TableCell>
                        {transposedData[0].slice(1).map((_, index) => (
                          <TableCell key={index}>{index + 1 + currentPage * rowsPerPage}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
                      {transposedData.map((row, index) => (
                        <TableRow key={index}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Grid item xs={12} sm={12} sx={{ marginTop: 2, '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35" } }}>
                    <TablePagination
                      component="div"
                      count={productosAñadidos.length}
                      page={currentPage}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Filas por página"
                      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                      rowsPerPageOptions={[3]}
                      sx={{
                        border: '2px solid #e2e2e2',
                        '& .MuiTablePagination-toolbar': {
                          backgroundColor: "#0f1b35",
                          color: '#e2e2e2',
                          display: 'flex',
                          justifyContent: 'center',
                        },
                        '& .MuiTablePagination-selectLabel': {
                          color: '#e2e2e2',
                          margin: '0 1%',
                        },
                        '& .MuiTablePagination-input': {
                          color: '#e2e2e2',
                          margin: '0 1%',
                        },
                        '& .MuiTablePagination-selectIcon': {
                          color: '#e2e2e2',
                        },
                        '& .MuiTablePagination-displayedRows': {
                          color: '#e2e2e2',
                          margin: '0 1%',
                        },
                        '& .MuiTablePagination-actions': {
                          color: '#e2e2e2',
                        }
                      }}
                    />
                  </Grid>
                </Box>
                </Grid>
              </Grid>
              )}
            </Box>
          </Grid>
          <CustomRegisterUser
            number={12}
            label="Precio Total"
            type='Number'
            value={precioTotal}
            onChange={(e) => {setPrecioTotal(e.target.value)}}
            required={true}
            readOnly={true}
            icon={<AttachMoney />}
          /> 
        </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{
              backgroundColor: '#e2e2e2',
              color: '#0f1b35',
              marginTop: 2.5,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#1a7b13',
                color: '#e2e2e2',
                border: '2px solid #e2e2e2',
                },
              }}
            >Añadir producto al almacen
          </Button>
        </form>
      </Box>
    </div>
  );
};
