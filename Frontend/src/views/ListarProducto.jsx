import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Box  } from '@mui/material';
import { Search, Description, ProductionQuantityLimits, AllInbox, Group, AddBusiness, AttachMoney, Inventory, CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomTablaProducto from '../components/CustomTablaProducto';
import CustomSelectUser from '../components/CustomSelectUser';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectProvee from '../components/CustomSelectProvee';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

export const ListarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ complementos, setComplementos ] = useState([]);
  const [buscar, setBuscar] = useState('');
  const usuario_ = localStorage.getItem('id');
  const navigate = useNavigate();
  const proveedorRef = useRef();

  useEffect(() => {
    axios.get(`${UrlReact}/producto/mostrar`, configInicial )
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setProductos(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  useEffect(() => {
    axios.get(`${UrlReact}/proveedor/mostrar`, configInicial )
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setProveedores(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  useEffect(() => {
    const nombre = 'TIPOS'
    axios.get(`${UrlReact}/complemento/buscarNombre/${nombre}`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setComplementos(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  const btnActualizar = (producto) => {
    
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/producto/buscar/${producto._id}`, configInicial)
        .then(response => {
          const { _id, nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion } = response;
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={12} id="nombre" label="Nombre del Producto" type="text" defaultValue={nombre} required={true} icon={<ProductionQuantityLimits />} />
              <CustomActualizarUser number={6} id="capacidad" label="Capacidad de presentacion" type="Number" defaultValue={capacidad_presentacion} required={true} icon={<Inventory />} />
              <CustomActualizarUser number={6} id="precio" label="Precio" type="Number" defaultValue={precioCompra} required={true} icon={<AttachMoney />} />
              <CustomActualizarUser number={12} id="descripcion" label="Descripcion" type="text" defaultValue={descripcion} required={true} icon={<Description />} />
              <CustomSelectUser number={6} id="tipo-select" label="Seleccione el tipo de presentacion" value={tipo} roles={complementos}/>
              <CustomSelectProvee number={6} id="proveedor-select" label="Seleccione el proveedor del producto" value={proveedor._id} roles={proveedores} ref={proveedorRef}/>
            </Grid>
          );
          Swal.fire({
            title: 'EDITAR AL PRODUCTO',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
              const nombre_ = document.getElementById('nombre').value;
              const capacidad_presentacion_ = parseInt(document.getElementById('capacidad').value);
              const precioCompra_ = parseInt(document.getElementById('precio').value);
              const descripcion_ = document.getElementById('descripcion').value;
              const tipo_ = document.getElementById('tipo-select').textContent;
              const proveedor_ = proveedorRef.current.getSelectedRole();
              return { nombre_, capacidad_presentacion_, precioCompra_, descripcion_, tipo_, proveedor_ };
            },
          customClass: {
            popup: 'customs-swal-popup',
            title: 'customs-swal-title',
            confirmButton: 'swal2-confirm custom-swal2-confirm',
            cancelButton: 'swal2-cancel custom-swal2-cancel',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { nombre_, capacidad_presentacion_, precioCompra_, descripcion_, tipo_, proveedor_ } = result.value;
            axios.put(`${UrlReact}/producto/actualizar/${_id}`, {
              nombre: nombre_,
              tipo: tipo_,
              descripcion: descripcion_,
              proveedor: proveedor_, 
              precioCompra: precioCompra_,
              capacidad_presentacion: capacidad_presentacion_,
              usuario_actualizacion: usuario_,
            }, configInicial)
            .then((response) => {
              setProductos(response.productosEncontrados);
              CustomSwal({ icono: 'success', titulo: 'Actualización Exitosa', mensaje: response.mensaje });
          })
          .catch((error) => {
            CustomSwal({ icono: 'error', titulo: 'Error al actualizar el Usuario', mensaje: error.mensaje });
          });
        }
      });
    })
    .catch(error => {
      CustomSwal({ icono: 'error', titulo: 'Error al actualizar el Usuario', mensaje: error.mensaje });
    });
    }
  };

  const btnMostrar = (producto) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/producto/buscar/${producto._id}`, configInicial)
        .then(response => {
          const { nombre, tipo, descripcion, proveedor, precioCompra, capacidad_presentacion, usuario_registro, usuario_actualizacion, fecha_registro, fecha_actualizacion } = response;
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
              <CustomActualizarUser number={12} label="Nombre del Producto" defaultValue={nombre} readOnly = {true} icon={<ProductionQuantityLimits />} />
              <CustomActualizarUser number={6} label="Nombre del Proveedor" defaultValue={proveedor.nombre_marca} readOnly={true} icon={<AddBusiness />} />
              <CustomActualizarUser number={6} label="Precio" defaultValue={precioCompra} readOnly={true} icon={<AttachMoney />} />
              <CustomActualizarUser number={12} label="Descripcion" defaultValue={descripcion} readOnly={true} icon={<Description />} />
              <CustomActualizarUser number={6} label="Tipo de presentacion" defaultValue={tipo} readOnly = {true} icon={<AllInbox/>} />
              <CustomActualizarUser number={6} label="Capacidad de presentacion" defaultValue={capacidad_presentacion} readOnly={true} icon={<Inventory />} />
              <CustomActualizarUser number={6} label="Usuario que registro" defaultValue={`${usuario_registro.nombre} ${usuario_registro.apellido}`} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Usuario que actualizo" defaultValue={`${usuario_actualizacion.nombre} ${usuario_actualizacion.apellido}`} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Fecha de registro" defaultValue={fechaRegistro} readOnly = {true} icon={<CalendarMonth />} />
              <CustomActualizarUser number={6} label="Fecha de actualización" defaultValue={fechaActualizacion} readOnly = {true} icon={<CalendarMonth />} />
            </Grid>
          );
          Swal.fire({
            title: 'MOSTRAR PRODUCTO',
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
 
  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Lista de Productos'} />
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
        <CustomTablaProducto usuarios={productos} buscar={buscar} botonMostrar={btnMostrar} botonActualizar={btnActualizar}/>
      </Box>
    </div>
  )
}
