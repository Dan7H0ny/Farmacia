import React, {useState} from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { Person } from '@mui/icons-material';

const CustomSelectUser = ({ number, id, label, value, roles }) => {
  const [selectedRole, setSelectedRole] = useState(value);
  return (
    <Grid item xs={12} sm={number} sx={{marginTop: 2,}}>
      <FormControl fullWidth>
        <InputLabel id={`${id}-label`} sx={{ color: '#0f1b35' }}>{label}</InputLabel>
        <Select
          id={id}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          label={label}
          required
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
        >
          {roles.map((r) => (
            <MenuItem key={r.nombre} value={r.nombre}>
              {r.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default CustomSelectUser;

