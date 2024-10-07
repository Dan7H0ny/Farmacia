import React from 'react';
import { Typography, Grid, Box, Paper } from '@mui/material';

const CustomPedidos = ({ productos }) => {
  return (
    <Box padding={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            component={Paper}
            padding={1}
            style={{
              maxHeight: 160,
              overflowY: 'auto',
            }}>
            {productos.map((producto, index) => (
              <Box key={index} marginBottom={2} padding={1} border={1} borderRadius={2}>
                <Typography variant="h6" align="center">
                  <strong>{producto.nombre}</strong>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      <strong>Precio de Compra:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      {producto.precioCompra + ' Bs'} {/* Valor predeterminado */}
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
                      <strong>Tipo:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      {producto.tipo} {/* Valor predeterminado */}
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

export default CustomPedidos;
