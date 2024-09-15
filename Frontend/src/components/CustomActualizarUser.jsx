import React from 'react';
import { Grid, TextField, InputAdornment } from '@mui/material';

const CustomActualizarUser = ({
  number,
  id,
  label,
  type,
  defaultValue,
  placeholder,
  required,
  rows,
  multiline,
  readOnly,
  showIconOnly,
  icon,
  operacion,
  ...props
}) => {
  return (
    <Grid item xs={12} sm={number} sx={{ '& .MuiTextField-root': { backgroundColor: '#e2e2e2' } }}>
      {showIconOnly ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', border: '2px solid #e2e2e2', padding: '1%' }}>
          <strong>Estado:</strong> {icon}
        </div>
      ) : (
        <TextField
          id={id}
          label={label}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          fullWidth
          required={required}
          rows={rows}
          multiline={multiline}
          margin="normal"
          InputProps={{
            readOnly: readOnly,
            sx: { color: '#0f1b35' },
            startAdornment: (
              <InputAdornment position="start" sx={{ color: '#0f1b35' }}>
                {icon}
              </InputAdornment>
            ),
            ...props.InputProps
          }}
          inputProps={{
            min: 0,
            step: "any",
            pattern: type === 'number' ? "[0-9]*" : undefined,
            inputMode: type === 'number' ? "decimal" : undefined,
            ...props.inputProps
          }}
          onInput={(e) => {
            if (type === 'number') {
              const cleanedValue = e.target.value
                .replace(/[^0-9.]/g, '')        // Elimina caracteres no numéricos
                .replace(/(\..*)\./g, '$1');   // Permite solo un punto decimal
              e.target.value = cleanedValue;
            }
          }}
        />
      )}
    </Grid>
  );
};

export default CustomActualizarUser;
