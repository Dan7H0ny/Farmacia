import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import {  Grid, Box, } from '@mui/material';
import { Search, Person, Email, PhoneAndroid, Phone, Badge, Numbers, CalendarMonth, Group} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../assets/css/listarUsuario.css';
import { createRoot } from 'react-dom/client';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomTablaClient from '../components/CustomTablaClient';
import CustomSelectC from '../components/CustomSelectC';
import CustomRegisterUser from '../components/CustomRegisterUser';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

export const ListarCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [ complementos, setComplementos ] = useState([]);
  const usuario_ = localStorage.getItem('id');
  const proveedorRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const nombre = 'Identificación'
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

  useEffect(() => {
    axios.get(`${UrlReact}/cliente/mostrar`, configInicial )
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setClientes(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  const btnActualizar = (cliente) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/cliente/buscar/${cliente._id}`, configInicial)
        .then(response => {
          const { _id, nombreCompleto, correo, telefono, numberIdentity, stringIdentity } = response;
          console.log(complementos)
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={12} id="nombreCompleto" label="Nombre Completo" type="text" defaultValue={nombreCompleto} required={true} icon={<Person />} />
              <CustomActualizarUser number={6} id="correo" label="Correo" type="email" defaultValue={correo} required={false} icon={<Email />} />
              <CustomActualizarUser number={6} id="telefono" label="Telefono" type="number" defaultValue={telefono} required={false} icon={<Phone />} />
              <CustomActualizarUser number={6} id="numberIdentity" label="Numero de Identidad" type="number" defaultValue={numberIdentity} required={true} icon={<Badge />} />
              <CustomSelectC number={6} id="identidad-select" label="Seleccione la identidad del cliente" value={stringIdentity._id} roles={complementos} ref={proveedorRef} icon={<Badge />}/>
            </Grid>
          );
          Swal.fire({
            title: 'ACTUALIZAR AL CLIENTE',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
              const nombreCompleto_ = document.getElementById('nombreCompleto').value;
              const correo_ = document.getElementById('correo').value;
              const telefono_ = parseInt(document.getElementById('telefono').value);
              const numberIdentity_ = parseInt(document.getElementById('numberIdentity').value);
              const stringIdentity_ = proveedorRef.current.getSelectedRole();
              return { nombreCompleto_, correo_, telefono_, numberIdentity_, stringIdentity_ };
            },
          customClass: {
            popup: 'customs-swal-popup',
            title: 'customs-swal-title',
            confirmButton: 'swal2-confirm custom-swal2-confirm',
            cancelButton: 'swal2-cancel custom-swal2-cancel',
          },
          didOpen: () => {
            setTimeout(() => {
              const nombreInput = document.getElementById('nombreCompleto');
              const telefonoInput = document.getElementById('telefono');
              const identidadInput = document.getElementById('numberIdentity');

              if (nombreInput) {
                nombreInput.addEventListener('input', function () {
                  this.value = this.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                });
              }

              if (telefonoInput) {
                telefonoInput.addEventListener('input', function () {
                  this.value = this.value.replace(/[^\d]/g, '');
                  if (this.value.length > 8) {
                    this.value = this.value.slice(0, 8);
                  }
                });
              }

              if (identidadInput) {
                identidadInput.addEventListener('input', function () {
                  this.value = this.value.replace(/[^\d]/g, '');
                  if (this.value.length > 8 ) {
                    this.value = this.value.slice(0, 8);
                  }
                });
              }
            }, 0);
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { nombreCompleto_, correo_, telefono_, numberIdentity_, stringIdentity_ } = result.value;
            axios.put(`${UrlReact}/cliente/actualizar/${_id}`, {
              nombreCompleto: nombreCompleto_,
              correo: correo_,
              telefono: telefono_,            
              numberIdentity: numberIdentity_,
              stringIdentity: stringIdentity_,
              usuario_actualizacion: usuario_
            }, configInicial)
            .then((response) => {
              setClientes(response.clientes);
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

  const btnMostrar = (cliente) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/cliente/buscar/${cliente._id}`, configInicial)
        .then(response => {
          const { nombreCompleto, correo, telefono, numberIdentity, stringIdentity, fecha_registro, fecha_actualizacion, usuario_registro, usuario_actualizacion } = response;
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
              <CustomActualizarUser number={12} label="Nombre Completo del Cliente" defaultValue={nombreCompleto} readOnly = {true} icon={<Person />} />
              <CustomActualizarUser number={6} label="Correo del Cliente" defaultValue={correo} readOnly = {true} icon={<Email/>} />
              <CustomActualizarUser number={6} label="Telefono del Cliente" defaultValue={telefono} readOnly={true} icon={<PhoneAndroid />} />
              <CustomActualizarUser number={6} label="Numero de Identidad del Cliente" defaultValue={numberIdentity} readOnly={true} icon={<Numbers />} />
              <CustomActualizarUser number={6} label="Tipo de Identidad del Cliente" defaultValue={stringIdentity.nombre} readOnly={true} icon={<Badge />} />
              <CustomActualizarUser number={6} label="Numero del Usuario que Registro" defaultValue={usuario_registro.nombre + ' ' + usuario_registro.apellido} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Numero del Usuario que Actualizo" defaultValue={usuario_actualizacion.nombre + ' ' + usuario_registro.apellido} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Rol del Usuario que Registro" defaultValue={usuario_registro.rol} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Rol del Usuario que Actualizo" defaultValue={usuario_actualizacion.rol} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Fecha de registro" defaultValue={fechaRegistro} readOnly = {true} icon={<CalendarMonth />} />
              <CustomActualizarUser number={6} label="Fecha de actualización" defaultValue={fechaActualizacion} readOnly = {true} icon={<CalendarMonth />} />
            </Grid>
          );
          Swal.fire({
            title: 'MOSTRAR CLIENTE',
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
        <CustomTypography text={'Lista De Los Clientes'} />
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
        <CustomTablaClient usuarios={clientes} buscar={buscar} botonMostrar={btnMostrar} botonActualizar={btnActualizar}/>
      </Box>
    </div>
    )
  }
