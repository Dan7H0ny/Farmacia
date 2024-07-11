import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { Badge } from '@mui/icons-material';

const CustomSelectC = forwardRef(({ number, id, label, value, roles }, ref) => {
  const [selectedRole, setSelectedRole] = useState(value);

  useImperativeHandle(ref, () => ({
    getSelectedRole: () => selectedRole,
  }));

  return (
    <Grid item xs={12} sm={number} sx={{marginTop: 2,}}>
      <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#e2e2e2', borderRadius: 1, mb: 1 }}>
        <InputLabel id={`${id}-label`} sx={{ color: '#0f1b35' }}>{label}</InputLabel>
        <Select
          id={id}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          label={label}
          required
          startAdornment={
            <InputAdornment position="start" sx={{ color: '#0f1b35' }}>
              <Badge /> {/* Aquí se agrega el icono */}
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
            <MenuItem key={r._id} value={r._id}>
              {r.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
});

export default CustomSelectC;
