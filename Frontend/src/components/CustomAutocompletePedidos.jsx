import React from 'react';
import { Autocomplete, TextField, Grid, Typography, Box } from '@mui/material';

const CustomAutocompletePedidos = ({ productos, productosAñadidos, setProductosAñadidos, inputValue, setInputValue }) => {
  return (
    <>
      <Grid item xs={12} sm={12}>
        <Autocomplete
          multiple
          options={productos}
          getOptionLabel={(option) => option.producto.nombre + ' ' + option.producto.descripcion}
          isOptionEqualToValue={(option, value) => option._id === value._id}
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
              label="Seleccione el producto solicitado"
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                sx: { backgroundColor: '#e2e2e2', color: '#0f1b35' }, // Colores personalizados
              }}
              sx={{
                backgroundColor: '#0f1b35', // Cambia el fondo del TextField
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0f1b35', // Color del borde
                  },
                  '&:hover fieldset': {
                    borderColor: '#0f1b35', // Color del borde al pasar el ratón
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
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option._id}>
              <Grid container alignItems="center" sx={{ background:'#e2e2e2', textAlign:'center'}}>
                <Grid item xs={3}>
                  <Typography variant="body1" sx={{ color: '#0f1b35', fontWeight: 'bold', }}>
                    {option.producto.nombre + ' ' + option.producto.descripcion}
                  </Typography>
                </Grid>
                <Grid item xs={3.5}>
                  <Typography variant="body2" sx={{ color: '#0f1b35' }}>
                    {option.categoria.nombre}
                  </Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <Typography variant="body2" sx={{ color: '#0f1b35' }}>
                    {option.cantidad_stock}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" sx={{ color: 'red' }}>
                    {new Date(option.fecha_caducidad).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" sx={{ color: '#0f1b35' }}>
                    {'Bs ' + option.precioVenta}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          )}
          PaperComponent={({ children }) => (
            <Box sx={{ mt: 1, border: '1px solid #ccc', borderRadius: '4px', maxHeight: '250px', overflow: 'auto', background:'#e2e2e2', color: '#e2e2e2' }}>
              {/* Encabezado "sticky" dentro del menú */}
              <Box sx={{ 
                position: 'sticky', 
                top: 0, 
                backgroundColor: '#0f1b35', 
                zIndex: 1, 
                paddingBottom: 1, 
                borderBottom: '2px solid #ccc', 
                marginBottom: '5px' 
              }}>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign:'center' }}>
                      Nombre
                    </Typography>
                  </Grid>
                  <Grid item xs={3.5}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign:'center' }}>
                      Categoría
                    </Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign:'center' }}>
                      Cantidad
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign:'center' }}>
                      Fecha Caducidad
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign:'center' }}>
                      Precio
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              {/* Opciones del Autocomplete */}
              {children}
            </Box>
          )}
        />
      </Grid>
    </>
  );
};

export default CustomAutocompletePedidos;
