import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { Person } from '@mui/icons-material';

const CustomSelectTime = ({ number, id, label, value, onChange, roles, ...props }) => {
  return (
    <Grid item xs={12} sm={number} sx={{marginTop: 'auto',}}>
      <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#e2e2e2', borderRadius: 1, mb: 2 }}>
        <InputLabel
          id={`${id}`}
          sx={{
            color: '#e2e2e2',
            position: 'absolute',
            background: '#0f1b35',
            padding: '0 25px',
            textTransform: 'uppercase',
          }}
        >
        {label}
        </InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value}
          onChange={onChange}
          required
          fullWidth
          label={label}
          startAdornment={
            <InputAdornment position="start" sx={{ color: '#0f1b35' }}>
              <Person /> {/* Aquí se agrega el icono */}
            </InputAdornment>
          }
          sx={{
            color: '#0f1b35',
            backgroundColor: '#e2e2e2',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0f1b35',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0f1b35',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0f1b35',
            },
            '& .MuiSvgIcon-root': {
              color: '#0f1b35',
            },
            '&.MuiSelect-select': {
              backgroundColor: '#0f1b35',
              color: '#e2e2e2',
            },
            '&:focus': {
              backgroundColor: '#0f1b35',
              color: '#e2e2e2',
            },
          }}
          {...props}
        >
          {roles.map((rol) => (
            <MenuItem key={rol.nombre} value={rol.nombre} sx={{ color: '#0f1b35', backgroundColor: '#e2e2e2' }}>
              {rol.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default CustomSelectTime;
