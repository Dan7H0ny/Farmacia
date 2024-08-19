import React, { useMemo } from 'react';
import axios from 'axios';
import { Grid, Button } from '@mui/material';
import { Web, MailOutline, Phone, Numbers } from '@mui/icons-material';
import Swal from 'sweetalert2';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomSwal from '../components/CustomSwal';

const CustomsPedidos = ({ proveedor, ProductoId, tipoNombre, capacidad_presentacion }) => {
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;

  const obtenerToken = () => { 
    const token = localStorage.getItem('token'); 
    return token; 
  }; 

  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const handleButtonClick = async (type) => {
    const cantidad = document.getElementById('capacidad').value;
    if (!cantidad) {
      Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese una cantidad</div>');
      return false;
    }
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea enviar un mensaje a través de ${type}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // Enviar el pedido
        await axios.post(
          `${UrlReact}/pedidos/crear`, 
          { producto: ProductoId, cantidad: cantidad * capacidad_presentacion }, 
          configInicial
        );
        CustomSwal({
          icono: 'success',
          titulo: 'Pedido creado',
          mensaje: 'El pedido ha sido creado exitosamente.'
        });

        switch (type) {
          case 'Sitio Web':
            window.open(proveedor.sitioweb, '_blank');
            break;
          case 'Correo':
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${proveedor.correo}&su=Consulta&body=Hola,%20me%20interesa%20más%20sobre%20su%20producto.`, '_blank');
            break;
          case 'Whatsapp':
            window.open(`https://wa.me/591${proveedor.telefono}?text=Hola,%20me%20interesa%20más%20sobre%20su%20producto.`, '_blank');
            break;
          default:
            break;
        }
      } catch (error) {
        CustomSwal({
          icono: 'error',
          titulo: 'Error',
          mensaje: error.mensaje
        });
      }
    }
  };

  return (
    <>
      <CustomActualizarUser 
        number={12} 
        id="capacidad" 
        label={`Pedido por ${tipoNombre}`} 
        type="Number" 
        required={true} 
        icon={<Numbers />}
      />
      {proveedor.sitioweb && (
        <Grid item xs={12} sm={4}>
          <Button
            onClick={() => handleButtonClick('Sitio Web')}
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
        <Grid item xs={12} sm={4}>
          <Button
            onClick={() => handleButtonClick('Correo')}
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
        <Grid item xs={12} sm={4}>
          <Button
            onClick={() => handleButtonClick('Whatsapp')}
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
    </>
  );
};

export default CustomsPedidos;
