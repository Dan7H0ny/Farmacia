import React, { useMemo } from 'react';
import axios from 'axios';
import { Grid, Button} from '@mui/material';
import { Web, MailOutline, Phone, Numbers } from '@mui/icons-material';
import Swal from 'sweetalert2';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomSwal from '../components/CustomSwal';

const CustomsPedidos = ({ proveedor, ProductoId, tipoNombre, capacidad_presentacion, cantidadEstimada, precioCompra, datos, usuario_ }) => {

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;

  const obtenerToken = () => { 
    const token = localStorage.getItem('token'); 
    return token; 
  }; 

  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const handleCreateOrder = async () => {
    const cantidad = document.getElementById('capacidad').value;
    if (!cantidad) {
      Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese una cantidad</div>');
      return false;
    }
    const cantidadNum = parseFloat(cantidad);
    if (!Number.isInteger(cantidadNum)) {
      Swal.showValidationMessage('<div class="custom-validation-message">Solo se permiten números enteros</div>');
      return false;
    }
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea crear el pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // Preparar el objeto de datos para la solicitud POST
        const formData = new FormData();
        formData.append('producto', ProductoId);
        formData.append('cantidad', cantidadNum * capacidad_presentacion);
        formData.append('precio', capacidad_presentacion * precioCompra);
        formData.append('capacidad', capacidad_presentacion);

        // Enviar el pedido
        await axios.post(`${UrlReact}/pedidos/crear`, formData, configInicial);
        CustomSwal({
          icono: 'success',
          titulo: 'Pedido creado',
          mensaje: 'El pedido ha sido creado exitosamente.'
        });
      } catch (error) {
        CustomSwal({
          icono: 'error',
          titulo: 'Error',
          mensaje: error.mensaje
        });
      }
    }
  };

  const handleRedirect = (url) => {
    window.open(url, '_blank');
  };
  const mensajeCorreo = `  Estimada empresa (${proveedor.nombre_marca})

  Estoy interesado en obtener más información sobre el siguiente PRODUCTO, a continuación los datos del producto:

  Nombre del producto: ${datos.nombre}
  Tipo: ${tipoNombre}
  Cantidad estimada: ${cantidadEstimada}

  Agradezco su pronta respuesta, me despido.

  Saludos!
  
  Atentamente:
  ________________________________________________________________
  Lic: ${usuario_.nombre} ${usuario_.apellido}
  Cel: ${usuario_.telefono}
  `;

  const mensajeWhatsApp = `  Estimada empresa (${proveedor.nombre_marca})

  Estoy interesado en obtener más información sobre el siguiente PRODUCTO, a continuación los datos del producto:

  Nombre del producto: ${datos.nombre}
  Tipo: ${tipoNombre}
  Cantidad estimada: ${cantidadEstimada}

  Agradezco su pronta respuesta, me despido.

  Saludos!

  Atentamente:
  ________________________________________________________________
  Lic: ${usuario_.nombre} ${usuario_.apellido}
  Correo: ${usuario_.correo}`;

  return (
    <>
      <Grid item xs={12}>
        <CustomActualizarUser 
          number={12} 
          id="capacidad" 
          label={`Cantidad a pedir por ${tipoNombre} sugerido`}
          defaultValue={cantidadEstimada} 
          type="Number" 
          required={true} 
          icon={<Numbers />}
        />
      </Grid>
      {proveedor.sitioweb && (
        <Grid item xs={4}>
          <Button
            onClick={() => handleRedirect(proveedor.sitioweb)}
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
        <Grid item xs={4}>
          <Button
            onClick={() => handleRedirect(`https://mail.google.com/mail/?view=cm&fs=1&to=${proveedor.correo}&su=Consulta&body=${encodeURIComponent(mensajeCorreo)}`)}
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
        <Grid item xs={4}>
          <Button
            onClick={() => handleRedirect(`https://wa.me/591${proveedor.telefono}?text=${encodeURIComponent(mensajeWhatsApp)}`)}
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
      <Grid item xs={12}>
        <Button
          onClick={handleCreateOrder}
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
          Crear Pedido
        </Button>
      </Grid>
    </>
  );
};

export default CustomsPedidos;
