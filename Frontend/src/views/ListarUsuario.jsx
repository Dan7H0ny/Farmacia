import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import {  Grid, Box, } from '@mui/material';
import { Search, Person, Email, PhoneAndroid, Room, Password, SupervisedUserCircle, Group, CalendarMonth, Cancel, CheckCircle} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import CustomRegisterUser from '../components/CustomRegisterUser';
import '../assets/css/menu.css';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomTabla from '../components/CustomTabla';
import CustomSelectUser from '../components/CustomSelectUser';
import { ReporteUsuario } from '../Reports/ReporteUsuario';
import ReporteExcelUsuario from '../Reports/ReporteExcelUsuario';

export const ListarUsuario = () => {
  const [usuarios, setUsuario] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [user, setUser] = useState('');
  
  const usuario_ = localStorage.getItem('id');

  const navigate = useNavigate();
  const roles = [{ nombre: 'Administrador' }, { nombre: 'Cajero' }, ];

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
        else {setUser(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact, usuario_]);
  
  useEffect(() => {
    axios.get(`${UrlReact}/usuario/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setUsuario(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact]);
  
  const btnActualizar = (usuario) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/usuario/buscar/${usuario._id}`, configInicial)
        .then(response => {
          const { _id, nombre, apellido, rol, direccion, telefono, correo } = response;
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={6} id="nombre" label="Nombre" type="text" defaultValue={nombre} required={true} icon={<Person />} />
              <CustomActualizarUser number={6} id="apellido" label="Apellido" type="text" defaultValue={apellido} required={true} icon={<SupervisedUserCircle />} />
              <CustomActualizarUser number={6} id="correo" label="Correo" type="email" defaultValue={correo} required={true} icon={<Email />} />
              <CustomSelectUser number={6} id="rol-select" label="Seleccione el rol del usuario:" value={rol} roles={roles} />
              <CustomActualizarUser number={6} id="telefono" label="Telefono" type="number" defaultValue={telefono} required={false} icon={<PhoneAndroid />} />
              <CustomActualizarUser number={6} id="password" label="Password" type="password" defaultValue={""} required={false} icon={<Password />} />
              <CustomActualizarUser number={12} id="direccion" label="Direccion" type="text" defaultValue={direccion} required={false} icon={<Room />} />
            </Grid>
          );
          Swal.fire({
            title: 'EDITAR DATOS DEL USUARIO',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
              const nombre_ = document.getElementById('nombre').value;
              const apellido_ = document.getElementById('apellido').value;
              const correo_ = document.getElementById('correo').value;
              const rol_ = document.getElementById('rol-select').textContent;
              const direccion_ = document.getElementById('direccion').value;
              const telefono_ = parseInt(document.getElementById('telefono').value);
              let password_ = document.getElementById('password').value;
              
              const nameRegex = /^[A-Za-záéíóúüñÁÉÍÓÚÑ\s]+$/;
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              
              if (!nameRegex.test(nombre_)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un nombre válido (solo letras y espacios)</div>');
                return false;
              }
            
              if (!nameRegex.test(apellido_)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un apellido válido (solo letras y espacios)</div>');
                return false;
              }
              if (correo_ === "") {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el correo del usuario</div>');
                return false;
              }

              if (!emailRegex.test(correo_)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un correo electrónico válido</div>');
                return false;
              }
              if (document.getElementById('telefono').value !== "" && (isNaN(telefono_) || telefono_ < 60000000 || telefono_ > 79999999)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un número de teléfono válido, si es necesario</div>');
                return false;
              }
              return { nombre_, apellido_, direccion_, telefono_, correo_, rol_, password_ };
            },
            customClass: {
              popup: 'customs-swal-popup',
              title: 'customs-swal-title',
              confirmButton: 'swal2-confirm custom-swal2-confirm',
              cancelButton: 'swal2-cancel custom-swal2-cancel',
            },
            didOpen: () => {
              setTimeout(() => {
                const nombreInput = document.getElementById('nombre');
                const apellidoInput = document.getElementById('apellido');
                const telefonoInput = document.getElementById('telefono');

                if (nombreInput) {
                  nombreInput.addEventListener('input', function () {
                    this.value = this.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                  });
                }

                if (apellidoInput) {
                  apellidoInput.addEventListener('input', function () {
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
              }, 0);
            },
          }).then((result) => {
            if (result.isConfirmed) {
              const { nombre_, apellido_, direccion_, telefono_, correo_, rol_, password_ } = result.value;   
              axios.put(`${UrlReact}/usuario/actualizar/${_id}`, {
                nombre: nombre_,
                apellido: apellido_,
                direccion: direccion_,
                telefono: telefono_,
                correo: correo_,
                password: password_,
                rol: rol_,
              }, configInicial)
              .then((response) => {
                const usuariosActualizados = usuarios.map((usuario) => {
                if (usuario._id === _id) {
                  return {
                    ...usuario,
                    nombre: nombre_,
                    apellido: apellido_,
                    direccion: direccion_,
                    telefono: telefono_,
                    correo: correo_,
                    password: password_,
                    rol: rol_,
                  };
                } else {
                  return usuario;
                }
                });
                setUsuario(usuariosActualizados);
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
      axios.get(`${UrlReact}/usuario/buscar/${cliente._id}`, configInicial)
        .then(response => {
          const { nombre, apellido, rol, direccion, telefono, correo, estado, fecha_registro, fecha_actualizacion } = response;
          const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
          const fechaActualizacion = fecha_actualizacion ? formatDateTime(new Date(fecha_actualizacion)) : '';

          function formatDateTime(date) {
            const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
            const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
            return `${formattedDate} ${formattedTime}`;
          }
          let newEstado = '';
          let estadoIcon = null;
          if (!estado) {
            newEstado = 'Inactivo';
            estadoIcon = <Cancel style={{ color: 'red' }} />;
          } else {
            newEstado = 'Activo';
            estadoIcon = <CheckCircle style={{ color: 'green' }} />;
          }

          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={6} label="Nombre del Usuario" defaultValue={nombre} readOnly = {true} icon={<Person />} />
              <CustomActualizarUser number={6} label="Apellido del Usuario" defaultValue={apellido} readOnly = {true} icon={<SupervisedUserCircle />} />
              <CustomActualizarUser number={12} label="Correo del Usuario" defaultValue={correo} readOnly = {true} icon={<Email/>} />
              <CustomActualizarUser number={12}label="Direccion del Usuario" defaultValue={direccion} readOnly={true} icon={<Room />} />
              <CustomActualizarUser number={6} label="Rol del Usuario" defaultValue={rol} readOnly = {true} icon={<Group />} />
              <CustomActualizarUser number={6} label="Telefono del Usuario" defaultValue={telefono} readOnly={true} icon={<PhoneAndroid />} />
              <CustomActualizarUser number={6} label="Fecha de registro" defaultValue={fechaRegistro} readOnly = {true} icon={<CalendarMonth />} />
              <CustomActualizarUser number={6} label="Fecha de actualización" defaultValue={fechaActualizacion} readOnly = {true} icon={<CalendarMonth />} />
              <CustomActualizarUser number={12} label="Estado del Usuario" defaultValue={newEstado} readOnly = {true} icon={estadoIcon} showIconOnly={true} />
            </Grid>
          );
          Swal.fire({
            title: 'MOSTRAR USUARIO',
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
              ReporteUsuario(response, user); 
            }
          });
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: error});
        });
    }
  };  

  const handleSwitchChange = async (event, id) => {
    const nuevoEstado = event.target.checked ? true : false;
    try {
      await axios.put(`${UrlReact}/usuario/eliminar/${id}`, { estado: nuevoEstado }, configInicial);
      setUsuario((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario._id === id ? { ...usuario, estado: nuevoEstado } : usuario
        )
      );
      CustomSwal({ icono: 'success', titulo: 'Estado Actualizado', mensaje: 'El usuario a cambiado de estado ahora esta: ' + (nuevoEstado ? 'activo' : 'inactivo')}); 
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
    }
  };

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Lista De Los Usuarios'} />
        <form id="Form-1" className="custom-form" style={{ padding: 15}}>
        <Grid container spacing={3} >
          <CustomRegisterUser
            number={8}
            label="Buscar"  
            placeholder= 'Busca por nombre. apellido, rol o correo'
            type= 'text'
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            required={false}
            icon={<Search/>}
          />
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
            <ReporteExcelUsuario
              data={usuarios}
              fileName="Reporte de Usuarios"
              sheetName="Usuarios"
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
        </form>
        <CustomTabla usuarios={usuarios} buscar={buscar} handleSwitchChange={handleSwitchChange} botonMostrar={btnMostrar} botonActualizar={btnActualizar}/>
      </Box>
    </div>
  )
}
