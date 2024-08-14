import React, { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import {  Grid, Box, } from '@mui/material';
import { Search, Person, Email, PhoneAndroid, Phone, Badge, Numbers, CalendarMonth, Group, Extension} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../assets/css/listarUsuario.css';
import { createRoot } from 'react-dom/client';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomTablaClient from '../components/CustomTablaClient';
import CustomSelectC from '../components/CustomSelectC';
import CustomRegisterUser from '../components/CustomRegisterUser';
import { ReporteCliente } from '../Reports/ReporteCliente';
import ReporteExcelCliente from '../Reports/ReporteExcelCliente';

export const ListarCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [usuario, setUsuario] = useState('');
  const [ complementos, setComplementos ] = useState([]);
  const usuario_ = localStorage.getItem('id');
  const proveedorRef = useRef();

  const navigate = useNavigate();

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  useEffect(() => {
    axios.get(`${UrlReact}/usuario/buscar/${usuario_}`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setUsuario(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact, usuario_]);

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
  },[navigate, token, configInicial, UrlReact]);

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
  },[navigate, token, configInicial, UrlReact]);

  const btnActualizar = (cliente) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/cliente/buscar/${cliente._id}`, configInicial)
        .then(response => {
          const { _id, nombreCompleto, correo, telefono, numberIdentity, extension, plus, stringIdentity } = response;
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={12} id="nombreCompleto" label="Nombre Completo" type="text" defaultValue={nombreCompleto} required={true} icon={<Person />} />
              <CustomActualizarUser number={6} id="correo" label="Correo" type="email" defaultValue={correo} required={false} icon={<Email />} />
              <CustomActualizarUser number={6} id="telefono" label="Telefono" type="number" defaultValue={telefono} required={false} icon={<Phone />} />
              <CustomActualizarUser number={6} id="numberIdentity" label="Numero de Identidad" type="number" defaultValue={numberIdentity} required={true} icon={<Badge />} />
              <CustomActualizarUser number={3} id="plus" label="Plus" type="number" defaultValue={plus} required={true} icon={<Numbers />} />
              <CustomActualizarUser number={3} id="extension" label="Extension" type="text" defaultValue={extension} required={false} icon={<Extension />} />
              <CustomSelectC number={12} id="identidad-select" label="Seleccione la identidad del cliente" value={stringIdentity._id} roles={complementos} ref={proveedorRef} icon={<Badge />}/>
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
              const plus_ = parseInt(document.getElementById('plus').value);
              const stringIdentity_ = proveedorRef.current.getSelectedRole();
              const extension_ = document.getElementById('extension').value;

              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
              if (!nombreCompleto_) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el nombre del cliente</div>');
                return false;
              }
              if (document.getElementById('correo').value !== "" && !emailRegex.test(correo_)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un correo electrónico válido para el cliente</div>');
                return false;
              }

              if (document.getElementById('telefono').value !== "" && (isNaN(telefono_) || telefono_ < 60000000 || telefono_ > 79999999)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un número de teléfono válido, si es requerido</div>');
                return false;
              }
              if (!numberIdentity_) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el numero de identificacion del cliente</div>');
                return false;
              }
              if (!stringIdentity_) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor seleccione el tipo de identificacion del cliente</div>');
                return false;
              }
              return { nombreCompleto_, correo_, telefono_, numberIdentity_, plus_, stringIdentity_, extension_ };
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
              const plusInput = document.getElementById('plus');
              const extensionInput = document.getElementById('extension');

              if (nombreInput) {
                nombreInput.addEventListener('input', function () {
                  this.value = this.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                });
              }

              if (extensionInput) {
                extensionInput.addEventListener('input', function () {
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

              if (plusInput) {
                plusInput.addEventListener('input', function () {
                  this.value = this.value.replace(/[^\d]/g, '');
                  if (this.value.length > 4) {
                    this.value = this.value.slice(0, 4);
                  }
                });
              }

              if (identidadInput) {
                identidadInput.addEventListener('input', function () {
                  this.value = this.value.replace(/[^\d]/g, '');
                  if (this.value.length > 12 ) {
                    this.value = this.value.slice(0, 12);
                  }
                });
              }
            }, 0);
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { nombreCompleto_, correo_, telefono_, numberIdentity_, plus_, stringIdentity_, extension_ } = result.value;
            axios.put(`${UrlReact}/cliente/actualizar/${_id}`, {
              nombreCompleto: nombreCompleto_,
              correo: correo_,
              telefono: telefono_,            
              numberIdentity: numberIdentity_,
              plus: plus_,
              stringIdentity: stringIdentity_,
              extension: extension_,
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
          const { nombreCompleto, correo, telefono, extension, combinedIdentity, stringIdentity, fecha_registro, fecha_actualizacion, usuario_registro, usuario_actualizacion } = response;
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
              <CustomActualizarUser number={6} label="Numero de Identidad del Cliente" defaultValue={combinedIdentity} readOnly={true} icon={<Numbers />} />
              <CustomActualizarUser number={6} label="Extension" defaultValue={extension} readOnly={true} icon={<Extension />} />
              <CustomActualizarUser number={12} label="Tipo de Identidad del Cliente" defaultValue={stringIdentity.nombre} readOnly={true} icon={<Badge />} />
              <CustomActualizarUser number={6} label="Numero del Usuario que Registro" defaultValue={usuario_registro.nombre + ' ' + usuario_registro.apellido} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Numero del Usuario que Actualizo" defaultValue={usuario_actualizacion.nombre + ' ' + usuario_actualizacion.apellido} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Rol del Usuario que Registro" defaultValue={usuario_registro.rol} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Rol del Usuario que Actualizo" defaultValue={usuario_actualizacion.rol} readOnly={true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Fecha de registro" defaultValue={fechaRegistro} readOnly = {true} icon={<CalendarMonth />} />
              <CustomActualizarUser number={6} label="Fecha de actualización" defaultValue={fechaActualizacion} readOnly = {true} icon={<CalendarMonth />} />
            </Grid>
          );
          Swal.fire({
            title: 'MOSTRAR CLIENTE',
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
              ReporteCliente(response, usuario); 
            }
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
        <Grid container spacing={3} >
          <CustomRegisterUser
            number={8}
            label="Buscar"  
            placeholder= 'Buscar el nombre del usuario'
            type= 'text'
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            required={false}
            icon={<Search/>}
          />
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
            <ReporteExcelCliente
              data={clientes}
              fileName="Reporte de Clientes"
              sheetName="Clientes"
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
        </form>
        <CustomTablaClient usuarios={clientes} buscar={buscar} botonMostrar={btnMostrar} botonActualizar={btnActualizar}/>
      </Box>
    </div>
    )
  }
