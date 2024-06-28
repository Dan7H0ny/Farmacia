import React from 'react';
import { Grid, TextField, InputAdornment } from '@mui/material';

const CustomActualizarUser = ({ number, id, label, type, defaultValue, placeholder, required, readOnly, icon, ...props }) => {

  return (
      <Grid item xs={12} sm={number} sx={{ '& .MuiTextField-root': {backgroundColor: '#e2e2e2' }}}>
        <TextField
          id = {id}
          label = {label}
          type = {type}
          defaultValue={defaultValue}
          fullWidth
          required = {required}
          margin="normal"
          InputProps={{
            readOnly: readOnly,
            sx: { color: '#0f1b35' },
            startAdornment: (
              <InputAdornment position="start" sx={{color:'#0f1b35'}}>
                {icon}
              </InputAdornment>
            ),
            ...props.InputProps
          }}
        />
      </Grid>
  );
};

export default CustomActualizarUser;
