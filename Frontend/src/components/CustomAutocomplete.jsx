import React from 'react';
import { Autocomplete, TextField, Grid } from '@mui/material';

const CustomAutocomplete = ({ options, label, value, onChange, getOptionLabel, renderInput, id }) => {
  return (
    <Grid item xs={12} sm={6}>
      <Autocomplete
        id={id}
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" fullWidth />
        )}
      />
    </Grid>
  );
};

export default CustomAutocomplete;
