import React from 'react';
import { Grid, TextField, InputAdornment } from '@mui/material';

const CustomRegisterUser = ({ number, id, label, type, value, onChange, placeholder, required, readOnly, icon, ...props }) => {

  return (
    <Grid item xs={12} sm={number} sx={{ '& .MuiTextField-root': {backgroundColor: '#0f1b35',  }}}>
      <TextField
        id = {id}
        label = {label}
        type = {type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth
        required = {required}
        margin="normal"
        InputProps={{
          readOnly: readOnly,
          sx: { color: '#0f1b35',  backgroundColor: '#e2e2e2',  },
          startAdornment: (
            <InputAdornment position="start" sx={{color:'#0f1b35', }}>
              {icon}
            </InputAdornment>
          ),
          ...props.InputProps
        }}
        InputLabelProps={{ sx: { color: '#e2e2e2', position: 'absolute',background: '#0f1b35',padding: '0 25px', textTransform: 'uppercase'}, ...props.InputLabelProps,   }}
        sx={{ mb: 2, position: 'relative', '& .MuiInputBase-input': {color: '#0f1b35',},...props.sx, }}
      />
    </Grid>
  );
};

export default CustomRegisterUser;
