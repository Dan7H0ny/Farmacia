// src/components/CustomTextField.js
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const CustomTextField = ({ id, label, type, value, onChange, placeholder, required, icon, ...props }) => {
  return (
    <TextField
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth
      required={required}
      InputProps={{
        sx: { color: '#0f1b35' },
        startAdornment: (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ),
        ...props.InputProps
      }}
      InputLabelProps={{ ...props.InputLabelProps }}
      sx={{ mb: 2, ...props.sx }}
    />
  );
};

export default CustomTextField;
