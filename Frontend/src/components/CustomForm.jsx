import React from 'react';
import { Autocomplete, TextField, Grid, Box } from '@mui/material';
import '../assets/css/tabla.css';

const CustomForm = ({ productos, setSelectedProduct, selectedProduct }) => {
  const handleProductChange = (event, value) => {
    setSelectedProduct(value);
  };

  return (
    <Grid item xs={12} sm={12}>
      <Autocomplete
        options={productos}
        getOptionLabel={(option) => option.nombre}
        renderOption={(props, option) => (
          <li {...props}>
            {option.nombre} - {option.proveedor.nombre_marca} - {option.tipo.nombre}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccione el producto requerido"
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
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0095b0',
                backgroundColor: '#e2e2e2',
                fontSize: '25px',
              },
            }}
          />
        )}
        onChange={handleProductChange}
        sx={{ marginBottom: 2 }}
      />
      {selectedProduct && (
        <Box sx={{ border: '2px solid #e2e2e2', padding: 3, borderRadius: 1, backgroundColor: "#0f1b35", color: '#e2e2e2' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <strong>Producto:</strong> {selectedProduct.nombre}
            </Grid>
            <Grid item xs={12} sm={6}>
              <strong>Proveedor:</strong> {selectedProduct.proveedor.nombre_marca}
            </Grid>
            <Grid item xs={12} sm={6}>
              <strong>Presentación:</strong> {selectedProduct.tipo.nombre}
            </Grid>
            <Grid item xs={12} sm={6}>
              <strong>Capacidad:</strong> {selectedProduct.capacidad_presentacion}
            </Grid>
            <Grid item xs={12} sm={6}>
              <strong>Precio:</strong> {selectedProduct.precioCompra}
            </Grid>
          </Grid>
        </Box>
      )}
    </Grid>
  );
};

export default CustomForm;
