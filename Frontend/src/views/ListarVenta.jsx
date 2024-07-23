import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Box } from '@mui/material';
import { Search, AttachMoney, Person, DateRange } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomTablaVentas from '../components/CustomTablaVentas';
import CustomUpdate from '../components/CustomUpdate';
import CustomAutocomplete from '../components/CustomAutocomplete';

export const ListarVenta = () => {
  const [ventas, setVentas] = useState([]);
  const [buscar, setBuscar] = useState('');  
  const [productosList, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const usuario_ = localStorage.getItem('id');

  const navigate = useNavigate();  
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  useEffect(() => {
    axios.get(`${UrlReact}/almacen/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
          navigate('/Menu/Administrador');
        } else {
          const productosFiltrados = response.filter(producto => producto.estado === true);
          setProductos(productosFiltrados);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate, token, configInicial, UrlReact]);

  useEffect(() => {
    axios.get(`${UrlReact}/cliente/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
          navigate('/Menu/Administrador');
        } else {
          setClientes(response); 
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate, token, configInicial, UrlReact]);

  useEffect(() => {
    axios.get(`${UrlReact}/venta/mostrar`, configInicial )
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setVentas(response);console.log(response)}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact]);

  const btnMostrar = (venta) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/venta/buscar/${venta._id}`, configInicial)
        .then(response => {
          const { cliente, productos, precio_total, fecha_registro, fecha_actualizacion, usuario_registra, usuario_update } = response;
          const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
          const fechaActualizacion = fecha_actualizacion ? formatDateTime(new Date(fecha_actualizacion)) : '';

          function formatDateTime(date) {
            const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
            const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
            return `${formattedDate} ${formattedTime}`;
          }
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <Grid item xs={12}><CustomUpdate cliente={cliente} productos={productos}/></Grid>
              <CustomActualizarUser number={12} label="Precio Total" defaultValue={precio_total} readOnly={true} icon={<AttachMoney/>} />
              <CustomActualizarUser number={6} label="Fecha de Registro" defaultValue={fechaRegistro} readOnly={true} icon={<DateRange />} />
              <CustomActualizarUser number={6} label="Fecha de Edicion" defaultValue={fechaActualizacion} readOnly={true} icon={<DateRange />} />
              <CustomActualizarUser number={6} label="Usuario de Registro" defaultValue={usuario_registra.nombre + ' - ' + usuario_registra.apellido + ' - ' + usuario_registra.rol} readOnly={true} icon={<Person />} />
              <CustomActualizarUser number={6} label="Usuario de Edicion" defaultValue={usuario_update.nombre + ' - ' + usuario_update.apellido + ' - ' + usuario_update.rol} readOnly={true} icon={<Person />} />
            </Grid>
          );
          Swal.fire({
            title: 'DATOS DEL PRODUCTO EN EL ALMACEN',
            html: container,
            confirmButtonText: 'Atras',
            customClass: {
              popup: 'customs-swal-popup',
              title: 'customs-swal-title',
              confirmButton: 'swal2-confirm custom-swal2-confirm',  
              cancelButton: 'swal2-cancel custom-swal2-cancel',
            },
          });
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: error});
        });
    }
  };

  const btnActualizar = (venta) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/venta/buscar/${venta._id}`, configInicial)
        .then(response => {
          const { _id, cliente, productos, precio_total } = response;
          console.log(productos)
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomAutocomplete
                id="cliente-autocomplete"
                options={clientes}
                label="Seleccione el cliente"
                value={cliente}
                onChange={cliente}
                getOptionLabel={(option) => `${option.nombre}`}
              />
              <CustomActualizarUser number={6} id="precioCompra" label="Precio Total" type="Number" defaultValue={precio_total} readOnly={true} icon={<AttachMoney />}/>
            </Grid>
          );
          Swal.fire({
            title: 'ACTUALIZAR DATOS DEL PRODUCTO',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: async () => {
              const cliente_ = document.getElementById('precioVenta').value;
              const producto_ = document.getElementById('precioVenta').value;
              const precioCompra_ = parseInt(document.getElementById('precioCompra').value);
              return { cliente_, producto_, precioCompra_ };
          },
          customClass: {
            popup: 'customs-swal-popup',
            title: 'customs-swal-title',
            confirmButton: 'swal2-confirm custom-swal2-confirm',
            cancelButton: 'swal2-cancel custom-swal2-cancel',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { cliente_, producto_, precioCompra_ } = result.value;
            axios.put(`${UrlReact}/venta/actualizar/${_id}`, {
              cliente: cliente_,
              productos: producto_,
              precio_total: precioCompra_,
              usuario_actualizacion: usuario_,
            }, configInicial)
            .then((response) => {
              CustomSwal({ icono: 'success', titulo: 'Actualización Exitosa', mensaje: response.mensaje });
          })
          .catch((error) => {
            CustomSwal({ icono: 'error', titulo: 'Error al actualizar el Almacen', mensaje: error.mensaje });
          });
        }
      });
    })
    .catch(error => {
      CustomSwal({ icono: 'error', titulo: 'Error al actualizar el Almacen', mensaje: error.mensaje });
    });
    }
  };
 
  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Control de Almacen'} />
        <form id="Form-1" className="custom-form" style={{ padding: 15}}>
          <CustomRegisterUser
            number={12}
            label="Nombre"  
            placeholder= 'Buscar el nombre del usuario'
            type= 'text'
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            required={false}
            icon={<Search/>}
          />
        </form>
        <CustomTablaVentas usuarios={ventas} buscar={buscar} botonMostrar={btnMostrar} botonActualizar={btnActualizar}/>
      </Box>
    </div>
  )
}
