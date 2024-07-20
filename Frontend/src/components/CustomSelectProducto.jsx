import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Autocomplete, TextField, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  backgroundColor: '#e2e2e2',
  '& .MuiAutocomplete-inputRoot': {
    color: '#0f1b35',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.dark,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.main,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.dark,
  },
}));

const CustomSelectProducto = forwardRef(({ productos, id }, ref) => {
  const product = productos.find(producto => producto._id === id);
  const [inputValue, setInputValue] = useState(product.nombre);
  const [selectedProduct, setSelectedProduct] = useState(product);
  
  useImperativeHandle(ref, () => ({
    getSelectedProduct: () => selectedProduct,
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StyledAutocomplete
          options={productos}
          getOptionLabel={(option) => option.nombre}
          value={selectedProduct}
          onChange={(event, newValue) => {
            setSelectedProduct(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Seleccione el producto" variant="outlined" fullWidth />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="body1" component="span" sx={{ color: 'primary.main' }}>
                    {option.nombre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="span">
                    {` - ${option.proveedor.nombre_marca} - ${option.tipo.nombre} - ${option.capacidad_presentacion}`}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        {selectedProduct && (
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" align="left">
                <strong>Nombre del Producto:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="center">
                {selectedProduct.nombre}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="left">
                <strong>Capacidad Presentacion:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="center">
                {selectedProduct.capacidad_presentacion}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="left">
                <strong>Proveedor:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="center">
                {selectedProduct.proveedor.nombre_marca}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="left">
                <strong>Tipo:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="center">
                {selectedProduct.tipo.nombre}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="left">
                <strong>Precio de Compra:</strong>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" align="center">
                {selectedProduct.precioCompra}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
});

export default CustomSelectProducto;

