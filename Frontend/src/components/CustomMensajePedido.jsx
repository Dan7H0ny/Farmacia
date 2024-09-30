import React from 'react';
import { Grid, Button } from '@mui/material';
import { Web, Phone, MailOutline } from '@mui/icons-material';

const CustomMensajePedido = ({ proveedor, user, predicciones}) => {
  const BtnMensaje = (url) => {
    window.open(url, '_blank');
  };
  const mensajeCorreo = `  Estimada empresa (${proveedor.nombre_marca})

  Estoy interesado en obtener más información sobre el siguiente PRODUCTO, a continuación los datos del producto:

  Agradezco su pronta respuesta, me despido.

  Saludos!
  
  Atentamente:
  ________________________________________________________________
  Lic: ${user.nombre} ${user.apellido}
  Cel: ${user.telefono}
  `;

  const mensajeWhatsApp = `  Estimada empresa (${proveedor.nombre_marca})

  Estoy interesado en obtener más información sobre el siguiente PRODUCTO, a continuación los datos del producto:

  Agradezco su pronta respuesta, me despido.

  Saludos!

  Atentamente:
  ________________________________________________________________
  Lic: ${user.nombre} ${user.apellido}
  Correo: ${user.correo}`;


  return (
    <Grid item xs={12} sx={{margin:'auto'}}>
      <Grid container spacing={3}>
        {proveedor.sitioweb && (
          <Grid item xs={4} sx={{margin:'auto'}}>
            <Button
              onClick={() => BtnMensaje(proveedor.sitioweb)}
              startIcon={<Web />}
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                width: '100%',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                  border: '2px solid #e2e2e2',
                  },
                }}
              >
              Sitio Web
            </Button>
          </Grid>
        )}
        {proveedor.correo && (
          <Grid item xs={4} sx={{margin:'auto'}}>
            <Button
              onClick={() => BtnMensaje(`https://mail.google.com/mail/?view=cm&fs=1&to=${proveedor.correo}&su=Consulta&body=${encodeURIComponent(mensajeCorreo)}`)}
              startIcon={<MailOutline />}
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                width: '100%',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                  border: '2px solid #e2e2e2',
                },
              }}
            >
              Correo
            </Button>
          </Grid>
        )}
        {proveedor.telefono && (
          <Grid item xs={4} sx={{margin:'auto'}}>
            <Button
              onClick={() => BtnMensaje(`https://wa.me/591${proveedor.telefono}?text=${encodeURIComponent(mensajeWhatsApp)}`)}
              startIcon={<Phone />}
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                width: '100%',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                  border: '2px solid #e2e2e2',
                },
              }}
            >
              Whatsapp
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default CustomMensajePedido;
