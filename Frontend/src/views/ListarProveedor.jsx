import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Box } from '@mui/material';
import { Search, PhoneAndroid, Email, AddBusiness,Language, LocalPhone, SupervisedUserCircle, CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import { createRoot } from 'react-dom/client';
import CustomTablaPro from '../components/CustomTablaPro';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomTypography from '../components/CustomTypography';
import { ReporteProveedor } from '../Reports/ReporteProveedor';
import ReporteExcelProveedor from '../Reports/ReporteExcelProveedor';

export const ListarProveedor = () => {
  const [proveedores, setproveedores] = useState([]);
  const [buscar, setBuscar] = useState('');

  const navigate = useNavigate();

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  useEffect(() => {
    axios.get(`${UrlReact}/proveedor/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setproveedores(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact] );

  const btnActualizar = (proveedor) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/proveedor/buscar/${proveedor._id}`, configInicial)
        .then(response => {
          const { _id, nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular } = response;
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={12} id="marca" label="Marca" type="text" defaultValue={nombre_marca} required={true} icon={<AddBusiness />} />
              <CustomActualizarUser number={6} id="correo" label="Correo" type="email" defaultValue={correo} required={false} icon={<Email />} />
              <CustomActualizarUser number={6} id="telefono" label="Telefono" type="number" defaultValue={telefono} required={false} icon={<LocalPhone />} />
              <CustomActualizarUser number={12} id="sitioWeb" label="Sitio Web" type="text" defaultValue={sitioweb} required={false} icon={<Language />} />
              <CustomActualizarUser number={12} id="nombre" label="Nombre del Vendedor" type="text" defaultValue={nombre_vendedor} required={true} icon={<SupervisedUserCircle />} />
              <CustomActualizarUser number={6} id="correoV" label="Correo del Vendedor" type="email" defaultValue={correo_vendedor} required={false} icon={<Email />} />
              <CustomActualizarUser number={6} id="celular" label="Celular del Vendedor" type="number" defaultValue={celular} required={false} icon={<PhoneAndroid />} />
            </Grid>
          );
          Swal.fire({
            title: 'ACTUALIZAR AL PROVEEDOR',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
              const nombre_marca_ = document.getElementById('marca').value;
              const correo_ = document.getElementById('correo').value;
              const telefono_ = parseInt(document.getElementById('telefono').value);
              const sitioweb_ = document.getElementById('sitioWeb').value;
              const nombre_vendedor_ = document.getElementById('nombre').value;
              const correo_vendedor_ = document.getElementById('correoV').value;
              const celular_ = parseInt(document.getElementById('celular').value);

              if (nombre_marca_ === "") {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el nombre de la marca</div>');
                return false;
              }
              if (nombre_vendedor_ === "") {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el nombre del vendedor</div>');
                return false;
              }
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

              if (document.getElementById('correo').value !== "" && !emailRegex.test(correo_)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un correo electrónico válido para el proveedor de la marca</div>');
                return false;
              }
              if (document.getElementById('correoV').value !== "" && !emailRegex.test(correo_)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un correo electrónico válido para el vendedor</div>');
                return false;
              }                   

              if (document.getElementById('telefono').value !== "" && (isNaN(telefono_) || telefono_ < 60000000 || telefono_ > 79999999)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un número de teléfono válido, si es requerido</div>');
                return false;
              }

              if (document.getElementById('celular').value !== "" && (isNaN(celular_) || celular_ < 60000000 || celular_ > 79999999)) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un número de celular válido, si es requerido</div>');
                return false;
              }
              return { nombre_marca_, correo_, telefono_, sitioweb_, nombre_vendedor_, correo_vendedor_, celular_ };
            },
            customClass: {
              popup: 'customs-swal-popup',
              title: 'customs-swal-title',
              confirmButton: 'swal2-confirm custom-swal2-confirm',
              cancelButton: 'swal2-cancel custom-swal2-cancel',
            },
            didOpen: () => {
              setTimeout(() => {
                const nombreInput = document.getElementById('marca');
                const apellidoInput = document.getElementById('nombre');
                const telefonoInput = document.getElementById('telefono');
                const celularInput = document.getElementById('celular');

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
                if (celularInput) {
                  celularInput.addEventListener('input', function () {
                    this.value = this.value.replace(/[^\d]/g, '');
                    if (this.value.length > 8) {
                      this.value = this.value.slice(0, 8);
                    }
                  });
                }
              }, 0);
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const { nombre_marca_, correo_, telefono_, sitioweb_, nombre_vendedor_, correo_vendedor_, celular_ } = result.value;
              axios.put(`${UrlReact}/proveedor/actualizar/${_id}`, {
                nombre_marca: nombre_marca_,
                correo: correo_,
                telefono: telefono_,
                sitioweb: sitioweb_,            
                nombre_vendedor: nombre_vendedor_,
                correo_vendedor: correo_vendedor_,
                celular: celular_,
              }, configInicial)
              .then((response) => {
                const proveedorActualizado = proveedores.map((proveedor) => {
                  if (proveedor._id === _id) {
                    return {
                      ...proveedor,
                      nombre_marca: nombre_marca_,
                      correo: correo_,
                      telefono: telefono_,
                      sitioweb: sitioweb_,            
                      nombre_vendedor: nombre_vendedor_,
                      correo_vendedor: correo_vendedor_,
                      celular: celular_,
                    };
                  } else {
                    return proveedor;
                  }
                });
                setproveedores(proveedorActualizado);
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

    const btnMostrar = (proveedor) => {
      if (!token) {
        CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
        navigate('/Menu/Administrador');
      } else {
        axios.get(`${UrlReact}/proveedor/buscar/${proveedor._id}`, configInicial)
          .then(response => {
            const { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular, fecha_registro, fecha_actualizacion } = response;
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
                <CustomActualizarUser number={12} label="Nombre de la marca del proveedor" defaultValue={nombre_marca} readOnly = {true} icon={<AddBusiness />} />
                <CustomActualizarUser number={4} label="Correo del proveedor" defaultValue={correo} readOnly = {true} icon={<Email />} />
                <CustomActualizarUser number={4} label="Telefono del proveedor" defaultValue={telefono} readOnly = {true} icon={<LocalPhone/>} />
                <CustomActualizarUser number={4} label="Sitio Web del proveedor" defaultValue={sitioweb} readOnly={true} icon={<Language />} />
                <CustomActualizarUser number={12} label="Nombre del vendedor" defaultValue={nombre_vendedor} readOnly = {true} icon={<SupervisedUserCircle />} />
                <CustomActualizarUser number={6} label="Correo del vendedor" defaultValue={correo_vendedor} readOnly={true} icon={<Email/>} />
                <CustomActualizarUser number={6} label="Celular del vendedor" defaultValue={celular} readOnly={true} icon={<PhoneAndroid />} />
                <CustomActualizarUser number={6} label="Fecha de registro" defaultValue={fechaRegistro} readOnly = {true} icon={<CalendarMonth />} />
                <CustomActualizarUser number={6} label="Fecha de actualización" defaultValue={fechaActualizacion} readOnly = {true} icon={<CalendarMonth />} />
              </Grid>
            );
            Swal.fire({
              title: 'MOSTRAR PROVEEDOR',
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
                ReporteProveedor(response); 
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
        <CustomTypography text={'Lista De Los Proveedores'} />
        <form id="Form-1" className="custom-form" style={{ padding: 15}}>
          <Grid container spacing={3} >
            <CustomRegisterUser
              number={8}
              label="Nombre"  
              placeholder= 'Busca por marca y nombre del vendedor'
              type= 'text'
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              required={false}
              icon={<Search/>}
            />
            <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
              <ReporteExcelProveedor
                data={proveedores}
                fileName="Reporte de Proveedores"
                sheetName="proveedores"
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </form>
        <CustomTablaPro usuarios={proveedores} buscar={buscar} botonMostrar={btnMostrar} botonActualizar={btnActualizar}/>
      </Box>
  </div>
  )
}
