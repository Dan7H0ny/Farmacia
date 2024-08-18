import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

const CustomSelectTipo = ({ tipo, cantidadStock, capacidadPresentacion }) => {
  // Inicializar el estado con "Unidades" para preseleccionar esta opción
  const [selectedTipo, setSelectedTipo] = useState('Unidades');

  const handleChange = (event) => {
    setSelectedTipo(event.target.value);
  };

  // Agregar la opción "Unidades" a las opciones de tipo.nombre
  const opciones = ['Unidades', tipo];

  // Determina el valor a mostrar basado en la opción seleccionada
  const valorMostrar = selectedTipo === 'Unidades' ? cantidadStock :  Math.floor(cantidadStock / capacidadPresentacion);

  return (
    <FormControl fullWidth>
      <InputLabel 
        id="tipo-label" 
        sx={{
          color: '#e2e2e2', 
          backgroundColor: '#0f1b35',
          padding: '0 8px',
          '&.Mui-focused': {
            backgroundColor: '#0f1b35',
            color: '#e2e2e2',
          }
        }}
      >
        Seleccionar Tipo
      </InputLabel>
      <Select
        labelId="tipo-label"
        value={selectedTipo}
        onChange={handleChange}
        label="Seleccionar Tipo"
        sx={{
          backgroundColor: '#e2e2e2',
          color: '#0f1b35',
          '& .MuiSelect-icon': {
            color: '#0f1b35',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0f1b35',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0f1b35',
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: '#e2e2e2',
              color: '#0f1b35',
            },
          },
        }}
      >
        {opciones.map((opcion, index) => (
          <MenuItem key={index} value={opcion} sx={{ color: '#0f1b35' }}>
            {opcion}
          </MenuItem>
        ))}
      </Select>
      <Typography variant="body1" sx={{ color: '#e2e2e2', marginTop: 1 }}>
        {valorMostrar}
      </Typography>
    </FormControl>
  );
};

export default CustomSelectTipo;
