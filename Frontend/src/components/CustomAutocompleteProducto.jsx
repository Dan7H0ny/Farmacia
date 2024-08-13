import React from 'react';
import { Autocomplete, TextField, Grid, Typography} from '@mui/material';

const CustomAutocompleteProducto = ({ productos, productosAñadidos, setProductosAñadidos, inputValue, setInputValue }) => {
  return (
    <>
      <Grid item xs={12} sm={12}>
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
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0095b0',
                  backgroundColor: '#e2e2e2',
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
    </>
  );
};

export default CustomAutocompleteProducto;
