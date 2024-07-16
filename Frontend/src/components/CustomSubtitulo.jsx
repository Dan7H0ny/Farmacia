import React from 'react';
import { Typography } from '@mui/material';

const CustomSubtitulo = ({text}) => {
  return (
    <Typography
      variant="h6"
      style={{
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: '35px',
        color: '#e2e2e2',
        backgroundColor: "#0f1b35",
        border: '2px solid #e2e2e2',
        padding: '0.5%', // Añadido para aumentar el espacio interno
        borderRadius: '10px', // Añadido para redondear los bordes
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Añadido para dar una sombra suave
        textTransform: 'uppercase',
      }}>
      {text}
    </Typography>
  );
};

export default CustomSubtitulo;
