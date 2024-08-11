import React from 'react';
import { Grid, TextField, InputAdornment } from '@mui/material';

const CustomRegisterUser = ({ number, id, label, type, value, onChange, placeholder, rows, required, multiline, readOnly, icon,onKeyPress, maxValue, minValue, ...props }) => {

  return (
    <Grid item xs={12} sm={number} sx={{marginTop: 'auto',}}>
      <TextField
        id = {id}
        label = {label}
        type = {type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows} 
        multiline = {multiline}
        fullWidth
        required = {required}
        margin="normal"
        InputProps={{
          max: maxValue,
          min: minValue,
          readOnly: readOnly,
          onKeyPress: onKeyPress,
          sx: { color: '#0f1b35',  backgroundColor: '#e2e2e2',  },
          startAdornment: (
            <InputAdornment position="start" sx={{color:'#0f1b35', }}>
              {icon}
            </InputAdornment>
          ),
          ...props.InputProps
        }}
        InputLabelProps={{ sx: { color: '#e2e2e2', position: 'absolute',background: '#0f1b35',padding: '0 25px', textTransform: 'uppercase'}, ...props.InputLabelProps,   }}
        sx={{ mb: 1, position: 'relative', '& .MuiInputBase-input': {color: '#0f1b35',},...props.sx, }}
      />
    </Grid>
  );
};

export default CustomRegisterUser;
