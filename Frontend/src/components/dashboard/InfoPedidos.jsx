import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, IconButton, Box, Grid } from '@mui/material';
import { Cancel, Check, Delete, Info, Inventory, Numbers, ProductionQuantityLimits, CalendarMonth, CheckCircle } from '@mui/icons-material'; // Importar el ícono de descarga
import { styled } from '@mui/system';
import { createRoot } from 'react-dom/client';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import CustomActualizarUser from '../../components/CustomActualizarUser';
import 'slick-carousel/slick/slick-theme.css';
import CustomSwal from '../CustomSwal';
import Swal from 'sweetalert2';
import { ReportePedido } from '../../Reports/ReportePedido';

const PedidoCard = styled(Card)(props => ({
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  backgroundColor: '#0f1b35',
  border: '2px solid #e2e2e2',
  color: '#e2e2e2',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingLeft: 35,
  paddingRight: 35,
}));

const ContentContainer = styled(Box)(props => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ActionsContainer = styled(Box)(props => ({
  display: 'flex',
  gap: '10px',
}));

const InfoPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  
  const [usuario, setUsuario] = useState('');
  const usuario_ = localStorage.getItem('id');

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => localStorage.getItem('token');
  const token = obtenerToken();
  const configInicial = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  useEffect(() => {
    axios.get(`${UrlReact}/usuario/buscar/${usuario_}`, configInicial)
      .then(response => {
        setUsuario(response);
      })
      .catch(error => { console.log(error);});
  }, [ token, configInicial, UrlReact, usuario_]);
  useEffect(() => {
    const mostrarPedidos = async () => {
      try {
        const response = await axios.get(`${UrlReact}/pedidos/mostrar`, configInicial);
        setPedidos(response); // Asegúrate de acceder a response.data
      } catch (error) {
        CustomSwal({ icono: 'error', titulo: 'Error', mensaje: 'Problema con la carga de pedidos' });
      }
    };
    mostrarPedidos();
  }, [UrlReact, configInicial]);

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const btnConfirmar = async (id, producto, cantidad) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este proceso actualizará el almacén y aceptara el pedido.',
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
          const response = await axios.put(`${UrlReact}/pedidos/actualizar/${id}`, { producto, cantidad, estado: 'Aceptado' }, configInicial);
          setPedidos(prevPedidos =>prevPedidos.map(pedido =>pedido._id === id ? { ...pedido, estado: 'Aceptado' } : pedido));
          CustomSwal({ icono: 'success', titulo: 'Actualizado', mensaje: response.mensaje });
        } catch (error) {
          CustomSwal({ icono: 'error', titulo: 'Error en el proceso', mensaje: error.mensaje });
        }
      }
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'No se ha realizado la acción', mensaje: 'Problema con el servidor' });
    }
  };

  const btnRechazar = async (id, producto, cantidad) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este proceso actualizará el almacén y rechazara el pedido.',
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
          const response = await axios.put(`${UrlReact}/pedidos/actualizar/${id}`, { producto, cantidad, estado: 'Rechazado' }, configInicial);
          setPedidos(prevPedidos =>prevPedidos.map(pedido =>pedido._id === id ? { ...pedido, estado: 'Rechazado' } : pedido));
          CustomSwal({ icono: 'success', titulo: 'Actualizado', mensaje: response.mensaje });
        } catch (error) {
          CustomSwal({ icono: 'error', titulo: 'Error en el proceso', mensaje: error.mensaje });
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
        text: 'Este proceso eliminara el pedido.',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Rechazar',
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
          CustomSwal({ icono: 'error', titulo: 'Error en el proceso', mensaje: error.mensaje });
        }
      }
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'No se ha realizado la acción', mensaje: 'Problema con el servidor' });
    }
  };

  const btnMostrar = (id) => {
    axios.get(`${UrlReact}/pedidos/buscar/${id}`, configInicial)
      .then(response => {
        const { producto, cantidad_total, precio_total, estado, fecha_registro} = response;
        const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
          function formatDateTime(date) {const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
            return `${formattedDate}`;
          }
          const container = document.createElement('div');
          const root = createRoot(container);

          let newEstado = '';
          let estadoIcon = null;
          if (estado === 'Rechazado') {
            newEstado = 'Rechazado';
            estadoIcon = <Cancel style={{ color: 'red' }} />;
          } else if (estado === 'Aceptado') {
            newEstado = 'Aceptado';
            estadoIcon = <CheckCircle style={{ color: 'green' }} />;
          }
          else if (estado === 'Pendiente') {
            newEstado = 'Pendiente';
            estadoIcon = <Info style={{ color: 'blue' }} />;
          }
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={12} label="Nombre del producto" defaultValue={producto.nombre} readOnly = {true} icon={<ProductionQuantityLimits />} />
              <CustomActualizarUser number={4} label="Capacidad Presentacion" defaultValue={producto.capacidad_presentacion} readOnly = {true} icon={<Inventory/>} />
              <CustomActualizarUser number={4} label="Cantidad Total" defaultValue={cantidad_total/producto.capacidad_presentacion} readOnly={true} icon={<Numbers />} />
              <CustomActualizarUser number={4} label="Precio Total" defaultValue={precio_total} readOnly={true} icon={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs</Typography>} />
              <CustomActualizarUser number={6} label="Estado" defaultValue={newEstado} readOnly={true} icon={estadoIcon} />
              <CustomActualizarUser number={6} label="Fecha de registro" defaultValue={fechaRegistro} readOnly = {true} icon={<CalendarMonth />} />
            </Grid>
          );
          Swal.fire({
            title: 'MOSTRAR PEDIDO',
            html: container,
            showCancelButton: true, 
            confirmButtonText: 'Atras',
            cancelButtonText: 'Imprimir',
            customClass: {
              popup: 'customs-swal-popup',
              title: 'customs-swal-title',
              confirmButton: 'swal2-cancel custom-swal2-cancel',  
              cancelButton: 'swal2-confirm custom-swal2-confirm',
            },
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              ReportePedido(response, usuario); 
            }
          });
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: error});
        });

  }; 

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <Box sx={{ padding: 2, background: '#0f1b35', marginBottom: 3 }}>
        <Typography variant="h6" sx={{ color: '#e2e2e2' }}>Buscar pedidos:</Typography>
        <input
          type="text"
          placeholder="Buscar por nombre del producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
        />
      </Box>
      {filteredPedidos.length === 0 ? (
        <></>
      ) : (
        <Slider {...settings}>
          {filteredPedidos.map((pedido) => (
            <PedidoCard key={pedido._id}>
              <CardContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <ContentContainer>
                  <Box style={{ flexGrow: 1 }}>
                    <Typography gutterBottom>
                      Producto: {pedido.producto.nombre}
                    </Typography>
                    <Typography variant="body2">
                      Cantidad: {(pedido.cantidad_total / pedido.producto.capacidad_presentacion)}
                    </Typography>
                    <Typography variant="body2">
                      Precio total: {(pedido.precio_total).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Estado: {pedido.estado}
                    </Typography>
                    <Typography variant="body2">
                      Fecha de registro: {new Date(pedido.fecha_registro).toLocaleString()}
                    </Typography>
                  </Box>
                  <ActionsContainer>
                    <IconButton
                      style={{
                        backgroundColor: '#1E90FF',
                        height: '40px',
                        width: '40px',
                        color: 'white'
                      }}
                      onClick={() => btnMostrar(pedido._id)}
                    >
                      <Info />
                    </IconButton>
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
                      onClick={() => btnRechazar(pedido._id, pedido.producto._id, pedido.cantidad_total)}
                    >
                      <Cancel />
                    </IconButton>
                    <IconButton
                      style={{
                        backgroundColor: '#e2e2e2',
                        height: '40px',
                        width: '40px',
                        color: 'red'
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
      <i className="fa fa-chevron-right"></i>
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
      <i className="fa fa-chevron-left"></i>
    </IconButton>
  );
};

export default InfoPedidos;
