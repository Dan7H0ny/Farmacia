import React from 'react';
import { Grid, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';
import { TagSharp } from '@mui/icons-material';

const CustomListaProductos = ({ productosAñadidos, setCantidad, cantidad }) => {
  
  const handleCantidadChange = (id, value) => {
    const cantidadValue = parseInt(value, 10);
    const producto = productosAñadidos.find(p => p._id === id);
  
    if (producto) {
      const minCantidad = 1;
      const maxCantidad = producto.cantidad_stock; 
  
      // Validar la cantidad ingresada
      if (cantidadValue < minCantidad || cantidadValue > maxCantidad || isNaN(cantidadValue)) {
        CustomSwal({
          icono: 'error',
          titulo: 'Cantidad no válida',
          mensaje: `La cantidad debe estar entre ${minCantidad} y ${maxCantidad}.`
        });
      } else {
        // Actualizar la cantidad del producto en el estado
        setCantidad(prev => ({
          ...prev,
          [id]: cantidadValue
        }));
      }
    }
  };

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
                  <TableCell>Stock</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Cantidad a llevar</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
                {productosAñadidos.map((producto, index) => {
                  const cantidadProducto = cantidad[producto._id] || 1;
                  const subtotal = producto.precioVenta * cantidadProducto;

                  return (
                    <TableRow key={producto._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{producto.producto.nombre}</TableCell>
                      <TableCell>{producto.categoria.nombre}</TableCell>
                      <TableCell>{new Date(producto.fecha_caducidad).toISOString().split('T')[0]}</TableCell>
                      <TableCell>{producto.cantidad_stock}</TableCell>
                      <TableCell>{producto.precioVenta.toFixed(2)}</TableCell>
                      <TableCell sx={{ width: '155px' }}>
                        <CustomRegisterUser
                          number={12}
                          placeholder='Ingrese la cantidad requerida'
                          type='number'
                          value={cantidadProducto}
                          onChange={(e) => handleCantidadChange(producto._id, e.target.value)}
                          required={true}
                          maxValue={producto.cantidad_stock}
                          minValue={1}
                          icon={<TagSharp />}
                        />
                      </TableCell>
                      <TableCell>{subtotal.toFixed(2)}</TableCell>
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