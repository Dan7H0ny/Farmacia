import React, { useState, useEffect } from 'react';
import { Grid, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectTipo from '../components/CustomSelectTipo';
import { TagSharp } from '@mui/icons-material';

const CustomListaProductos = ({ productosAñadidos, setCantidad, cantidad, setPrecioTotal }) => {
  const [valores, setValores] = useState({});

  const actualizarValores = (id, valorMostrar) => {
    setValores(prev => ({
      ...prev,
      [id]: valorMostrar
    }));
  };
  const handleTipoChange = (id) => {
    // Restablecer la cantidad a 1 cuando cambie el tipo
    setCantidad(prev => ({
      ...prev,
      [id]: 1
    }));
  };

  const handleCantidadChange = (id, value) => {
    const cantidadValue = parseInt(value, 10);
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
      const cantidadProducto = cantidad[producto._id] || 1;
      const valorMostrar = valores[producto._id] || producto.cantidad_stock;

      let subtotal;
      if (valorMostrar === producto.cantidad_stock) {
        subtotal = producto.precioVenta * cantidadProducto;
      } else {
        subtotal = producto.precioVenta * (cantidadProducto * producto.producto.capacidad_presentacion);
      }

      return acc + subtotal;
    }, 0);

    setPrecioTotal(total); // Llamar a la función pasada para actualizar el total en el componente padre
  }, [cantidad, valores, productosAñadidos, setPrecioTotal]);

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
                  const cantidadProducto = cantidad[producto._id] || 1;
                  const valorMostrar = valores[producto._id] || producto.cantidad_stock;
                  let subtotal;
                  if(valores[producto._id] === producto.cantidad_stock){
                    subtotal = producto.precioVenta * cantidadProducto
                  }
                  else{
                    subtotal = producto.precioVenta * (cantidadProducto * producto.producto.capacidad_presentacion)
                  }
                  const valor = Math.floor(producto.cantidad_stock / producto.producto.capacidad_presentacion);
                  let estadoActual;
                  if(valor === 0){
                    estadoActual = null
                  }
                  else{
                    estadoActual = producto.producto.tipo.nombre
                  }

                  return (
                    <TableRow key={producto._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{producto.producto.nombre}</TableCell>
                      <TableCell>{producto.categoria.nombre}</TableCell>
                      <TableCell>{new Date(producto.fecha_caducidad).toISOString().split('T')[0]}</TableCell>
                      <TableCell>{producto.precioVenta.toFixed(2) + ' Bs'}</TableCell>
                      <TableCell sx={{ width: '155px' }}>
                        <CustomSelectTipo 
                          tipo={estadoActual} 
                          producto={producto}
                          NuevoValor={(valorMostrar) => actualizarValores(producto._id, valorMostrar)}
                          onTipoChange={() => handleTipoChange(producto._id)}
                        />
                      </TableCell>
                      <TableCell>{valorMostrar}</TableCell>
                      <TableCell sx={{ width: '155px' }}>
                        <CustomRegisterUser
                          number={12}
                          placeholder='Ingrese la cantidad requerida'
                          type='number'
                          value={cantidadProducto}
                          onChange={(e) => handleCantidadChange(producto._id, e.target.value)}
                          required={true}
                          maxValue={valorMostrar} // Usa el valor de stock actualizado
                          minValue={1}
                          icon={<TagSharp />}
                          onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}
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
        <Grid item xs={12}>
          {/* Opcional: Añadir un mensaje o componente para cuando no haya productos */}
        </Grid>
      )}
    </>
  );
};

export default CustomListaProductos;
