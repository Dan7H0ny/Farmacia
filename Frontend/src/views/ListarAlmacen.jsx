import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Box  } from '@mui/material';
import { Search, Description, ProductionQuantityLimits, AllInbox, Group, AddBusiness, AttachMoney, VerifiedUser, CalendarMonth, Filter9Plus, DateRange, Dangerous } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomTablaProducto from '../components/CustomTablaProducto';
import CustomSelectC from '../components/CustomSelectC';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectProvee from '../components/CustomSelectProvee';
import CustomForm from '../components/CustomForm';
import CustomTablaAlmacen from '../components/CustomTablaAlmacen';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

export const ListarAlmacen = () => {
  const [almacen, setAlmacen] = useState([]);
  const [productos, setProductos] = useState([]);
  const [complementos, setComplementos] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [buscarNuevo, setBuscarNuevo] = useState('');
  const [idproducto, setIdProducto] = useState('');
  const [datos, setDatos] = useState('');
  const usuario_ = localStorage.getItem('id');
  const navigate = useNavigate();
  const proveedorRef = useRef();
  const tipoRef = useRef();

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
    axios.get(`${UrlReact}/almacen/mostrar`, configInicial )
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setAlmacen(response);
          console.log(almacen)
        }
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  useEffect(() => {
    const nombre = 'Categoria'
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

  const btnAñadir = (producto) => {
    setDatos(producto)
    setIdProducto(producto._id)
  }

  const btnActualizar = (almacen) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/almacen/buscar/${almacen._id}`, configInicial)
        .then(response => {
          const { _id, producto, categoria, precioVenta, cantidad_stock, fecha_caducidad } = response;
          setDatos(producto)
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomActualizarUser number={12} id="buscar" label="Nombre del Producto" type="text" defaultValue={buscarNuevo} required={false} icon={<Search />} />
              <CustomForm productos={productos} buscar={buscarNuevo} btnAñadir={btnAñadir}/>
              <CustomActualizarUser number={12} id="Producto" label="Seleccione el producto" type="text" multiline= {true} readOnly = {true} defaultValue={datos?
                    `Producto:\t\t${datos.nombre}\nProveedor:\t\t${datos.proveedor.nombre_marca}\nTipo:\t\t\t${datos.tipo.nombre}\nCapacidad:\t\t${datos.tipo.nombre}\nPrecio de compra:\t${datos.precioCompra}` 
                    : ''} required={true} icon={<ProductionQuantityLimits />} />
              <CustomSelectC number={6} id="categoria" label="Seleccione la categoria" value={categoria._id} roles={complementos} ref={tipoRef} icon={<AllInbox />}/>
              <CustomActualizarUser number={6} id="precioVenta" label="Precio de Venta" type="Number" defaultValue={precioVenta} required={true} icon={<AttachMoney />} />
              <CustomActualizarUser number={6} id="stock" label="Cantidad de Stock" type="Number" defaultValue={cantidad_stock} required={true} icon={<Filter9Plus />} />
              <CustomActualizarUser number={6} id="fecha" label="Fecha de Caducidad" type="Date" defaultValue={fecha_caducidad} required={true} icon={<DateRange />} />
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
              const tipo_ = tipoRef.current.getSelectedRole();
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

  const btnMostrar = (almacen) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/almacen/buscar/${almacen._id}`, configInicial)
        .then(response => {
          const { producto, categoria, precioVenta, cantidad_stock, estado, fecha_caducidad, usuario_registro, usuario_actualizacion, fecha_registro, fecha_actualizacion } = response;
          const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
          const fechaActualizacion = fecha_actualizacion ? formatDateTime(new Date(fecha_actualizacion)) : '';
          const fechaCaducidad = fecha_caducidad ? formatDateTime(new Date(fecha_registro)) : '';
          console.log(producto)
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
              <Grid item xs={12} sm={6} sx={{marginTop: 'auto',}}>
                <CustomActualizarUser number={12} label="Datos del Producto" defaultValue={producto?
                      `Producto:\t\t${producto.nombre}\nProveedor:\t\t${producto.proveedor.nombre_marca}\nTipo:\t\t\t${producto.tipo.nombre}\nCapacidad:\t\t${producto.capacidad_presentacion}\nPrecio de compra:\t${producto.precioCompra}` 
                      : ''} rows={4.5}
                      multiline= {true} readOnly = {true} icon={<ProductionQuantityLimits />} />
                <CustomActualizarUser number={12} label="Categoria" defaultValue={categoria.nombre} readOnly={true} icon={<AddBusiness />} />
                <Grid container spacing={2}> 
                  <Grid item xs={12} sm={6} sx={{marginTop: 'auto',}}>
                    <CustomActualizarUser number={12} label="Precio" defaultValue={precioVenta} readOnly={true} icon={<AttachMoney />} />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{marginTop: 'auto',}}>
                    <CustomActualizarUser number={12} label="Stock" defaultValue={cantidad_stock} readOnly={true} icon={<Description />} />
                  </Grid>
                </Grid>
                <CustomActualizarUser number={12} label="Estado" defaultValue={estado ? "Activo" : "Inactivo"}  readOnly = {true} icon={estado ? <VerifiedUser color="success" /> : <Dangerous color="error" />} />
              </Grid>
              <Grid item xs={12} sm={6} sx={{marginTop: 'auto',}}>
                <CustomActualizarUser number={12} label="Fecha de caducidad" defaultValue={fechaCaducidad} readOnly={true} icon={<CalendarMonth />} />
                <CustomActualizarUser number={12} label="Usuario que registro" defaultValue={`${usuario_registro.nombre} ${usuario_registro.apellido}`} readOnly={true} icon={<Group />} />
                <CustomActualizarUser number={12} label="Usuario que actualizo" defaultValue={`${usuario_actualizacion.nombre} ${usuario_actualizacion.apellido}`} readOnly={true} icon={<Group />} />
                <CustomActualizarUser number={12} label="Fecha de registro" defaultValue={fechaRegistro} readOnly = {true} icon={<CalendarMonth />} />
                <CustomActualizarUser number={12} label="Fecha de actualización" defaultValue={fechaActualizacion} readOnly = {true} icon={<CalendarMonth />} />
              </Grid>
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

  const btnEstado = async (event, id) => {
    const nuevoEstado = event.target.checked ? true : false;
    try {
      await axios.put(`${UrlReact}/usuario/eliminar/${id}`, { estado: nuevoEstado }, configInicial);
      setAlmacen((prevAlmacen) =>
        prevAlmacen.map((a) =>
          a._id === id ? { ...a, estado: nuevoEstado } : almacen
        )
      );
      CustomSwal({ icono: 'success', titulo: 'Estado Actualizado', mensaje: 'El almacen a cambiado: ' + (nuevoEstado ? 'activo' : 'inactivo')}); 
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
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
        <CustomTablaAlmacen usuarios={almacen} buscar={buscar} botonMostrar={btnMostrar} botonEstado={btnEstado} botonActualizar={btnActualizar}/>
      </Box>
    </div>
  )
}
