import React, { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Box, Typography } from '@mui/material';
import { Search, Description, ProductionQuantityLimits, AllInbox, Group, AddBusiness, Inventory, CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomTablaProducto from '../components/CustomTablaProducto';
import CustomSelectC from '../components/CustomSelectC';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectProvee from '../components/CustomSelectProvee';
import CustomsPedidos from '../components/CustomsPedidos';
import { ReporteProducto } from '../Reports/ReporteProducto';
import ReporteExcelProducto from '../Reports/ReporteExcelProducto';

export const ListarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [complementos, setComplementos] = useState([]);
  const [usuario, setUsuario] = useState('');

  const [user, setUser] = useState('');
  const [buscar, setBuscar] = useState('');
  const usuario_ = localStorage.getItem('id');
  const navigate = useNavigate();
  const proveedorRef = useRef();
  const tipoRef = useRef();

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
    axios.get(`${UrlReact}/producto/mostrar`, configInicial )
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setProductos(response);}
      })
      .catch(error => { console.log(error);});
  },[navigate, token, configInicial, UrlReact]);

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
  },[navigate, token, configInicial, UrlReact]);

  useEffect(() => {
    const nombre = 'Tipo'
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
              <CustomActualizarUser number={6} id="capacidad" label="Capacidad de presentacion" type="Number" defaultValue={capacidad_presentacion} required={true} icon={<Inventory />}  onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}/>
              <CustomActualizarUser number={6} id="precio" label="Precio" type="Number" defaultValue={precioCompra} required={true} icon={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs</Typography>} onKeyPress={(e) => {
            // Permitir solo números y un punto decimal
            const isNumberOrPoint = /[0-9.]$/.test(e.key);
            if (!isNumberOrPoint) {
              e.preventDefault();
            }
            
            // Validar que solo haya un punto decimal
            const currentValue = e.target.value;
            if (e.key === '.' && currentValue.includes('.')) {
              e.preventDefault();
            }
          }}/>
              <CustomActualizarUser number={12} id="descripcion" label="Descripcion" type="text" defaultValue={descripcion} required={true} icon={<Description />} />
              <CustomSelectC number={6} id="identidad-select" label="Seleccione el tipo de presentacion" value={tipo._id} roles={complementos} ref={tipoRef} icon={<AllInbox />}/>
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
              const capacidad_presentacion_ = parseInt(document.getElementById('capacidad').value, 10);
              const precioCompra_ = document.getElementById('precio').value;
              const descripcion_ = document.getElementById('descripcion').value;
              const tipo_ = tipoRef.current.getSelectedRole();
              const proveedor_ = proveedorRef.current.getSelectedRole();
              if (nombre_ === "") {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el nombre del producto</div>');
                return false;
              }

              if (isNaN(capacidad_presentacion_) || !Number.isInteger(capacidad_presentacion_) || capacidad_presentacion_ <= 0) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese una capacidad de presentación válida (número entero positivo)</div>');
                return false;
              }
            
              if (!/^\d+(\.\d{1,2})?$/.test(precioCompra_) || parseFloat(precioCompra_) <= 0) {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un precio de compra válido (número decimal positivo con hasta dos decimales)</div>');
                return false;
              }
              if (tipo_ === "") {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el tipo de presentacion</div>');
                return false;
              }
              if (proveedor_ === "") {
                Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el nombre del proveedor</div>');
                return false;
              }
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
          console.log(response)
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
              <CustomActualizarUser number={6} label="Precio" defaultValue={precioCompra} readOnly={true} icon={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs</Typography>} />
              <CustomActualizarUser number={12} label="Descripcion" defaultValue={descripcion} readOnly={true} icon={<Description />} />
              <CustomActualizarUser number={6} label="Tipo de presentacion" defaultValue={tipo.nombre} readOnly = {true} icon={<AllInbox/>} />
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
              ReporteProducto(response, usuario); 
            }
          });
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: error});
        });
    }
  };
  
  const btnPedir = (producto) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/producto/buscar/${producto._id}`, configInicial)
        .then(response => {
          const { producto, cantidadEstimada } = response;
          const { _id, proveedor, nombre, precioCompra, tipo, capacidad_presentacion } = producto;
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={12} label="Nombre del Producto" defaultValue={nombre} readOnly = {true} icon={<ProductionQuantityLimits />} />
              <CustomActualizarUser number={6} label="Nombre del Proveedor" defaultValue={proveedor.nombre_marca} readOnly={true} icon={<AddBusiness />} />
              <CustomActualizarUser number={6} label="Precio" defaultValue={precioCompra} readOnly={true} icon={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs</Typography>} />          
              <CustomActualizarUser number={6} label="Capacidad de presentacion" defaultValue={capacidad_presentacion} readOnly={true} icon={<Inventory />} />
              <CustomActualizarUser number={6} label="Tipo de presentacion" defaultValue={tipo.nombre} readOnly = {true} icon={<AllInbox/>} />
              <CustomsPedidos proveedor={proveedor} ProductoId={_id} tipoNombre={tipo.nombre} capacidad_presentacion={capacidad_presentacion} cantidadEstimada={cantidadEstimada} precioCompra={precioCompra} datos={producto} usuario_={user} />
            </Grid>
          );
          Swal.fire({
            title: 'HACER PEDIDO',
            html: container,
            showCancelButton: false,
            showConfirmButton:false,
            confirmButtonText: 'Hacer Pedido',
            cancelButtonText: 'Cancelar pedido',
            customClass: {
              popup: 'customs-swal-popup',
              title: 'customs-swal-title',
              confirmButton: 'swal2-confirm custom-swal2-confirm',
              cancelButton: 'swal2-cancel custom-swal2-cancel',
            },
          })
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
          <Grid container spacing={3} >
            <CustomRegisterUser
              number={8}
              label="Buscar"  
              placeholder= 'Busca por producto, proveedor o el tipo de presentacion'
              type= 'text'
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              required={false}
              icon={<Search/>}
            />
            <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
              <ReporteExcelProducto
                data={productos}
                fileName="Reporte de Productos"
                sheetName="productos"
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </form>
        <CustomTablaProducto usuarios={productos} buscar={buscar} botonMostrar={btnMostrar} botonActualizar={btnActualizar} botonPedir={btnPedir}/>
      </Box>
    </div>
  )
}
