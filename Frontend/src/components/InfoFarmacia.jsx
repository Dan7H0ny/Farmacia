import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const InfoFarmacia = () => {
  return (
    <Box 
      sx={{ 
        padding: '16px', 
        border: '1px solid #e2e2e2',  // Borde blanco
        borderRadius: '8px', 
        backgroundColor: '#0f1b35',  // Fondo oscuro para contraste
        color: '#e2e2e2',  // Color de texto blanco
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
        INFORMACION DE LA FARMACIA
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Dirección y Mapa
          </Typography>
          <Box 
            sx={{ 
              width: '100%', 
              height: '400px', 
              display: 'flex', 
              justifyContent: 'center'
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d326.0861167387149!2d-66.31775829888282!3d-17.395960948231888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e30b0042330849%3A0x8e349e734a4b16c8!2sFarmacia%20Emilina!5e0!3m2!1ses!2sbo!4v1723687059364!5m2!1ses!2sbo"
              width="100%"
              height="100%"
              style={{ border: '0' }}
              allowFullScreen=""
              loading="lazy"
              title="Mapa de la Farmacia Emilina"
            ></iframe>
          </Box>
        </Grid>
      </Grid>

      <Box 
        sx={{ 
          marginTop: '16px', 
          textAlign: 'center', 
          borderTop: '1px solid #e2e2e2',  // Borde blanco
          paddingTop: '8px',
        }}
      >
        <Typography variant="body2">
          © 2024 Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoFarmacia;