import React from 'react';
import { Typography, Grid, Box, Paper } from '@mui/material';

const CustomUpdate = ({ cliente, productos }) => {
  return (
    <Box padding={2}>
      <Grid container spacing={2}>
        {/* Datos del Cliente */}
        <Grid item xs={12}>
          <Typography variant="body2" align="center">
            <strong>DATOS DEL CLIENTE:</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="center">
            <strong>Nombre Completo:</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="center">
            {cliente.nombreCompleto}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="center">
            <strong>Identidad:</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" align="center">
            {cliente.stringIdentity?.nombre}: {cliente.numberIdentity}
          </Typography>
        </Grid>

        {/* Datos del Producto */}
        <Grid item xs={12}>
          <Typography variant="body2" align="center">
            <strong>DATOS DEL PRODUCTO:</strong>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            component={Paper}
            padding={2}
            style={{
              maxHeight: 280, // Altura máxima del cuadro de desplazamiento
              overflowY: 'auto',
            }}
          >
            {productos.map((producto, index) => (
              <Box key={index} marginBottom={2} padding={2} border={1} borderRadius={2}>
                <Typography variant="h6" align="center">
                  <strong>Producto {index + 1}</strong>
                </Typography>
                <Grid container spacing={2} marginTop={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      <strong>Producto:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      {producto.producto.producto.nombre} {/* Valor predeterminado */}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      <strong>Precio de Venta:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      {producto.producto.precioVenta} {/* Valor predeterminado */}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      <strong>Cantidad:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      {producto.cantidad_producto} {/* Valor predeterminado */}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      <strong>Proveedor:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      {producto.producto.producto.proveedor.nombre_marca} {/* Valor predeterminado */}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomUpdate;
