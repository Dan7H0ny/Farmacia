import React, { useState, useEffect } from 'react';
import { Grid, Box, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';

const CustomListaProductos = ({ productosAñadidos, setCantidad, cantidad, setPrecioTotal, setTiposSeleccionados, tiposSeleccionados }) => {
  const [valores, setValores] = useState({});
  const [selectedTipos, setSelectedTipos] = useState({}); // Estado para los tipos seleccionados

  const actualizarValores = (id, valorMostrar) => {
    setValores(prev => ({
      ...prev,
      [id]: valorMostrar
    }));
  };

  const actualizarTipo = (id, newTipo) => {
    setTiposSeleccionados(prev => ({
      ...prev,
      [id]: newTipo
    }));
  };

  const handleTipoChange = (id, newTipo) => {
    // Restablecer la cantidad a 1 cuando cambie el tipo
    setCantidad(prev => ({
      ...prev,
      [id]: 1
    }));
    setSelectedTipos(prev => ({
      ...prev,
      [id]: newTipo // Asegúrate de que se actualice
    }));
    // Calcula el nuevo valor a mostrar
    const producto = productosAñadidos.find(p => p._id === id);
    const valorMostrar = newTipo === 'Unidades'
      ? producto.cantidad_stock
      : Math.floor(producto.cantidad_stock / producto.producto.capacidad_presentacion);

    // Actualiza el valor y el estado
    actualizarValores(id, valorMostrar);
    actualizarTipo(id, newTipo);
  };

  const handleCantidadChange = (id, value) => {
    const cantidadValue = parseInt(value, 10) || 1;
    const producto = productosAñadidos.find(p => p._id === id);
    const maxCantidad = valores[id] || producto.cantidad_stock;

    if (producto) {
      const minCantidad = 1;

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
    // Calcular y enviar el subtotal total al componente padre
    const total = productosAñadidos.reduce((acc, producto) => {
      const cantidadProducto = cantidad[producto._id] || 1; // Asegura que la cantidad inicial sea 1
  
      // Obtener la selección actual o 'Unidades' si no hay valor
      const seleccion = tiposSeleccionados[producto._id] || selectedTipos[producto._id] || 'Unidades';
  
      let valorMostrar;
      let subtotal;
      if (seleccion !== 'Unidades') {
        // Si la selección es distinta de 'Unidades', mostrar stock dividido por capacidad de presentación
        valorMostrar = Math.floor(producto.cantidad_stock / producto.producto.capacidad_presentacion);
        subtotal = producto.precioVenta * (cantidadProducto * producto.producto.capacidad_presentacion);
      } else {
        // Si la selección es 'Unidades', mostrar el stock estándar
        valorMostrar = producto.cantidad_stock;
        subtotal = producto.precioVenta * cantidadProducto;
      }
  
      actualizarValores(producto._id, valorMostrar);
      return acc + subtotal;
    }, 0);
    setPrecioTotal(total);
  }, [cantidad, valores, productosAñadidos, setPrecioTotal, tiposSeleccionados, selectedTipos]);
  

  return (
    <>
      {productosAñadidos && productosAñadidos.length > 0 ? (
        <Grid item xs={12} sm={12}>
          <Box sx={{ height: '500px', overflowY: 'auto' }}>
            <Table className="table table-bordered" style={{ marginTop: '1.5%', border: '2px solid #e2e2e2' }}>
              <TableHead className="text-center" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', fontWeight: 'bold', border: '2px solid #e2e2e2' } }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Fecha Caducidad</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Como vender</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Cantidad a llevar</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
                {productosAñadidos.map((producto, index) => {
                  const cantidadProducto = cantidad[producto._id] || 1; // Asegura que la cantidad inicial sea 1

                  // Obtener la selección actual o 'Unidades' si no hay valor
                  const seleccion = tiposSeleccionados[producto._id] || selectedTipos[producto._id] || 'Unidades';

                  // Calcular el valorMostrar
                  let valorMostrar;
                  let subtotal;
                  if (seleccion !== 'Unidades') {
                    // Si la selección es distinta de 'Unidades', mostrar stock dividido por capacidad de presentación
                    valorMostrar = Math.floor(producto.cantidad_stock / producto.producto.capacidad_presentacion);
                    subtotal = producto.precioVenta * (cantidadProducto * producto.producto.capacidad_presentacion);
                  } else {
                    // Si la selección es 'Unidades', mostrar el stock estándar
                    valorMostrar = producto.cantidad_stock;
                    subtotal = producto.precioVenta * cantidadProducto;
                  }
                  const valor = Math.floor(producto.cantidad_stock / producto.producto.capacidad_presentacion);
                  let estadoActual = valor === 0 ? null : producto.producto.tipo.nombre;
                  
                  return (
                    <TableRow key={producto._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{producto.producto.nombre}</TableCell>
                      <TableCell>{producto.categoria.nombre}</TableCell>
                      <TableCell>{new Date(producto.fecha_caducidad).toISOString().split('T')[0]}</TableCell>
                      <TableCell>{producto.precioVenta.toFixed(2) + ' Bs'}</TableCell>
                      <TableCell sx={{ width: '155px' }}>
                        <FormControl fullWidth>
                          <InputLabel
                            id={`tipo-label-${producto._id}`}
                            sx={{
                              color: '#e2e2e2',
                              backgroundColor: '#0f1b35',
                              padding: '0 8px',
                              '&.Mui-focused': {
                                backgroundColor: '#0f1b35',
                                color: '#e2e2e2',
                              }
                            }}
                          >
                            Seleccionar Tipo
                          </InputLabel>
                            <Select
                              labelId={`tipo-label-${producto._id}`}
                              value={seleccion} // Ya no necesitas usar el valor por defecto aquí
                              onChange={(e) => handleTipoChange(producto._id, e.target.value)} // Maneja el cambio correctamente
                              label="Seleccionar Tipo"
                              sx={{
                                backgroundColor: '#e2e2e2',
                                color: '#0f1b35',
                                '& .MuiSelect-icon': {
                                  color: '#0f1b35',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#0f1b35',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#0f1b35',
                                }
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    backgroundColor: '#e2e2e2',
                                    color: '#0f1b35',
                                  },
                                },
                              }}
                            >
                              <MenuItem value="Unidades" sx={{ color: '#0f1b35' }}>
                                Unidades
                              </MenuItem>
                              <MenuItem value={estadoActual} sx={{ color: '#0f1b35' }}>
                                {estadoActual}
                              </MenuItem>
                            </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>{valorMostrar} ({producto.producto.capacidad_presentacion})</TableCell>
                      <TableCell sx={{ width: '155px' }}>
                        <CustomRegisterUser 
                          value={cantidadProducto}
                          type= 'number'
                          onChange={(e) => handleCantidadChange(producto._id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#0f1b35',
                              },
                              '&:hover fieldset': {
                                borderColor: '#0f1b35',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#0f1b35',
                              },
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>{subtotal.toFixed(2) + ' Bs'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      ) : (
<></>
      )}
    </>
  );
};

export default CustomListaProductos;
