import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { Delete, Check } from '@mui/icons-material';
import { styled } from '@mui/system';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CustomSwal from '../CustomSwal';
import Swal from 'sweetalert2';

const PedidoCard = styled(Card)({
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  backgroundColor: '#0f1b35',
  border: '2px solid #e2e2e2',
  color: '#e2e2e2',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingLeft: 35, // Padding añadido al contenedor de la tarjeta
  paddingRight: 35,
});

const ContentContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row', // Cambia la dirección del flex a fila
  alignItems: 'center', // Alinea verticalmente los elementos al centro
  justifyContent: 'space-between', // Espacio entre texto y botones
});

const ActionsContainer = styled(Box)({
  display: 'flex',
  gap: '10px', // Espacio entre los botones
});

const InfoPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };
  const token = obtenerToken();
  const configInicial = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  useEffect(() => {
    const mostrarPedidos = async () => {
      const response = await axios.get(`${UrlReact}/pedidos/mostrar`, configInicial);
      setPedidos(response); // Asegúrate de acceder a response.data
    };
    mostrarPedidos();
  }, [UrlReact, configInicial]);

  const btnConfirmar = async (id, producto, cantidad) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este proceso actualizará el almacén y eliminará el pedido.',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, actualizar',
        customClass: {
          popup: 'customs-swal-popup',
          title: 'customs-swal-title',
          cancelButton: 'swal2-cancel custom-swal2-cancel',
          confirmButton: 'swal2-confirm custom-swal2-confirm',
        },
      });
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${UrlReact}/pedidos/actualizar/${id}`, { producto, cantidad }, configInicial);
          setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido._id !== id));
          CustomSwal({ icono: 'success', titulo: 'Actualizado', mensaje: response.mensaje });
        } catch (error) {
          CustomSwal({ icono: 'error', titulo: 'Error en el proceso', mensaje: error.mensaje || 'Problema con el servidor' });
        }
      }
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'No se ha realizado la acción', mensaje: 'Problema con el servidor' });
    }
  };
  

  const btnEliminar = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este proceso eliminará el pedido.',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar',
        customClass: {
          popup: 'customs-swal-popup',
          title: 'customs-swal-title',
          cancelButton: 'swal2-cancel custom-swal2-cancel',
          confirmButton: 'swal2-confirm custom-swal2-confirm',
        },
      });
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${UrlReact}/pedidos/eliminar/${id}`, configInicial);
          setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido._id !== id));
          CustomSwal({ icono: 'success', titulo: 'Pedido Eliminado', mensaje: response.mensaje });
        } catch (error) {
          CustomSwal({ icono: 'error', titulo: 'Error en el proceso', mensaje: error.mensaje || 'Problema con el servidor' });
        }
      }
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'No se ha realizado la acción', mensaje: 'Problema con el servidor' });
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2, // Número de tarjetas visibles a la vez
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      {pedidos.length === 0 ? (
        <></>
      ) : (
        <Slider {...settings}>
          {pedidos.map((pedido) => (
            <PedidoCard key={pedido._id}>
              <CardContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <ContentContainer>
                  <Box style={{ flexGrow: 1 }}>
                    <Typography gutterBottom>
                      Producto: {pedido.producto.nombre}
                    </Typography>
                    <Typography variant="body2">
                      Cantidad: {pedido.cantidad_total}
                    </Typography>
                    <Typography variant="body2">
                      Registrado en: {new Date(pedido.fecha_registro).toLocaleString()}
                    </Typography>
                  </Box>
                  <ActionsContainer>
                    <IconButton
                      style={{
                        backgroundColor: '#4caf50',
                        height: '40px',
                        width: '40px',
                        color: '#fff'
                      }}
                      onClick={() => btnConfirmar(pedido._id, pedido.producto._id, pedido.cantidad_total)}
                    >
                      <Check />
                    </IconButton>
                    <IconButton
                      style={{
                        backgroundColor: '#f44336',
                        height: '40px',
                        width: '40px',
                        color: '#fff'
                      }}
                      onClick={() => btnEliminar(pedido._id)}
                    >
                      <Delete />
                    </IconButton>
                  </ActionsContainer>
                </ContentContainer>
              </CardContent>
            </PedidoCard>
          ))}
        </Slider>
      )}
    </>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      style={{ 
        position: 'absolute', 
        top: '50%', 
        right: '10px', 
        transform: 'translateY(-50%)', 
        zIndex: 1, 
        backgroundColor: '#e2e2e2',
        color: '#0f1b35'
      }}
    >
      <span style={{ fontSize: '24px' }}>→</span>
    </IconButton>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '10px', 
        transform: 'translateY(-50%)', 
        zIndex: 1, 
        backgroundColor: '#e2e2e2',
        color: '#0f1b35'
      }}
    >
      <span style={{ fontSize: '24px' }}>←</span>
    </IconButton>
  );
};

export default InfoPedidos;
