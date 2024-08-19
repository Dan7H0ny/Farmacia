import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const CustomSelectTipo = ({ tipo, producto, NuevoValor, onTipoChange}) => {
  const [selectedTipo, setSelectedTipo] = useState('Unidades');
  const opciones = ['Unidades', tipo].filter(opcion => opcion !== null);

  useEffect(() => {
    const valorMostrar = selectedTipo === 'Unidades'
      ? producto.cantidad_stock
      : Math.floor(producto.cantidad_stock / producto.producto.capacidad_presentacion);

    // Actualizar el valor mostrado en el componente padre
    NuevoValor(valorMostrar);

  }, [selectedTipo, producto, tipo, NuevoValor]);

  const handleTipoChange = (event) => {
    setSelectedTipo(event.target.value);
    if (onTipoChange) {
      onTipoChange();
    }
  };

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
        onChange={handleTipoChange}
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
    </FormControl>
  );
};

export default CustomSelectTipo;
