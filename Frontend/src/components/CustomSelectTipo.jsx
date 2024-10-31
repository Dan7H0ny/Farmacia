import React, { useState, useEffect, useRef } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const CustomSelectTipo = ({ tipo, producto, NuevoValor, onTipoChange, NuevoEstado }) => {
  const [selectedTipo, setSelectedTipo] = useState('Unidades');
  const opciones = ['Unidades', tipo].filter(opcion => opcion !== null);
  const isMounted = useRef(false); // Controla si el componente ya fue montado

  useEffect(() => {
    if (!isMounted.current) {
      const valorMostrar = producto.cantidad_stock; 
      NuevoValor(valorMostrar);
      NuevoEstado(selectedTipo);
      isMounted.current = true; 
    }
  }, [producto, NuevoValor, NuevoEstado, selectedTipo]); 

  const handleTipoChange = (event) => {
    const newTipo = event.target.value; 
    setSelectedTipo(newTipo); 

    // Calcula el nuevo valor a mostrar
    const valorMostrar = newTipo === 'Unidades'
      ? producto.cantidad_stock
      : Math.floor(producto.cantidad_stock / producto.producto.capacidad_presentacion);

    // Actualiza el valor en el componente padre y el estado
    NuevoValor(valorMostrar);
    NuevoEstado(newTipo);

    // Llama a la función pasada por el padre si existe
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
