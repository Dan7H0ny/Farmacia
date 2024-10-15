import React from 'react';
import { Autocomplete, TextField, Grid, Typography } from '@mui/material';

const CustomAutocompleteNuevo = ({ predicciones, idPrediccion, setIdPrediccion, inputPrediccion, setInputPrediccion }) => {
  return (
    <>
      <Grid item xs={12} sm={8} sx={{marginTop: 1.5,}}>
        <Autocomplete
          options={predicciones} // Asegurarse que sea un array
          getOptionLabel={(option) => option.nombreProducto || ''} // Manejar el caso donde el nombre no esté disponible
          isOptionEqualToValue={(option, value) => option._id === value._id}
          value={idPrediccion}
          onChange={(event, newValue) => {
            setIdPrediccion(newValue);
          }}
          inputValue={inputPrediccion}
          onInputChange={(event, newInputValue) => {
            setInputPrediccion(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Elija un producto"
              variant="outlined"
              fullWidth
              required
              InputProps={{
                ...params.InputProps,
                sx: { backgroundColor: '#e2e2e2', color: '#0f1b35' }, // Estilos personalizados
              }}
              sx={{
                backgroundColor: '#0f1b35',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#0f1b35',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0f1b35',
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
                    {option.nombreProducto}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="span">
                    {` - ${option.nombreCategoria}`}
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

export default CustomAutocompleteNuevo;
