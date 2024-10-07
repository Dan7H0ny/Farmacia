import React, { useEffect } from 'react';
import { Grid, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CustomSwal from './CustomSwal';
import CustomRegisterUser from './CustomRegisterUser';
import { TagSharp } from '@mui/icons-material';

const CustomListaProductosPedir = ({ productosAñadidos, setCantidad, cantidad, setPrecioTotal }) => {

  const handleCantidadChange = (id, value) => {
    const cantidadValue = parseInt(value, 10);
    const producto = productosAñadidos.find(p => p._id === id);

    if (producto) {
      const minCantidad = 1;

      if (cantidadValue < minCantidad || isNaN(cantidadValue)) {
        CustomSwal({
          icono: 'error',
          titulo: 'Cantidad no válida',
          mensaje: `La cantidad minima debe ser ${minCantidad}.`
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
    const total = productosAñadidos.reduce((acc, producto) => {
      const cantidadProducto = cantidad[producto._id] || 1;
      
      const subtotal = producto.precioCompra * cantidadProducto;

      return acc + subtotal;
    }, 0);

    setPrecioTotal(total);

  }, [cantidad, productosAñadidos, setPrecioTotal]);

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
                  <TableCell>Tipo de Presentacion</TableCell>
                  <TableCell>Capacidad Presentacion</TableCell>
                  <TableCell>Precio de compra</TableCell>
                  <TableCell>Cantidad estimada</TableCell>
                  <TableCell>Cantidad a pedir</TableCell>
                  <TableCell>Unidades a pedir</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
                {productosAñadidos.map((producto, index) => {
                  const cantidadProducto = cantidad[producto._id] || 1;
                  const subtotal = producto.precioCompra * cantidadProducto;

                  return (
                    <TableRow key={producto._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>{producto.tipo.nombre}</TableCell>
                      <TableCell>{producto.capacidad_presentacion}</TableCell>
                      <TableCell>{producto.precioCompra.toFixed(2) + ' Bs'}</TableCell>
                      <TableCell>{producto.cantidadEstimada}</TableCell>
                      <TableCell sx={{ width: '155px' }}>
                        <CustomRegisterUser
                          number={12}
                          placeholder='Ingrese la cantidad a pedir'
                          type='Number'
                          value={cantidadProducto}
                          onChange={(e) => handleCantidadChange(producto._id, e.target.value)}
                          required={true}
                          minValue={1}
                          icon={<TagSharp />}
                          onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}
                        />
                      </TableCell>
                      <TableCell>{producto.capacidad_presentacion * cantidadProducto}</TableCell>
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

export default CustomListaProductosPedir;
