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
            <strong>DATOS DE LA VENTA DE PRODUCTOS:</strong>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            component={Paper}
            padding={1}
            style={{
              maxHeight: 200, // Altura máxima del cuadro de desplazamiento
              overflowY: 'auto',
            }}
          >
            {productos.map((producto, index) => (
              <Box key={index} marginBottom={2} padding={1} border={1} borderRadius={2}>
                <Typography variant="h6" align="center">
                  <strong>{producto.nombre}</strong>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      <strong>Precio de Venta:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="center">
                      {producto.precio_venta} {/* Valor predeterminado */}
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
                      {producto.proveedor} {/* Valor predeterminado */}
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

export default CustomUpdate;
