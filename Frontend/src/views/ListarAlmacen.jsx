import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Box  } from '@mui/material';
import { Search, Description, ProductionQuantityLimits, Group, AddBusiness, AttachMoney, VerifiedUser, CalendarMonth, Filter9Plus, DateRange, Dangerous } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomSelectC from '../components/CustomSelectC';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectProducto from '../components/CustomSelectProducto';
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
  const usuario_ = localStorage.getItem('id');
  const navigate = useNavigate();
  const categoriaRef = useRef();
  const productoRef = useRef();

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
        else {setAlmacen(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  useEffect(() => {
    const nombre = 'Categoría'
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

 

  const btnActualizar = (almacen) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/almacen/buscar/${almacen._id}`, configInicial)
        .then(response => {
          const { _id, producto, categoria, precioVenta, cantidad_stock, fecha_caducidad } = response;
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} sx={{marginTop: 'auto',}}><CustomSelectProducto productos={productos} id={producto._id} ref={productoRef}/></Grid>
              <CustomSelectC number={6} id="categoria" label="Seleccione la categoria" value={categoria._id} roles={complementos} ref={categoriaRef} icon={<AddBusiness />}/>
              <CustomActualizarUser number={6} id="precioVenta" label="Precio de Venta" type="Number" defaultValue={precioVenta} required={true} icon={<AttachMoney />} />
              <CustomActualizarUser number={6} id="stock" label="Cantidad de Stock" type="Number" defaultValue={cantidad_stock} required={true} icon={<Filter9Plus />} />
              <CustomActualizarUser number={6} id="fecha" label="Fecha de Caducidad" type="Date" defaultValue={new Date(fecha_caducidad).toISOString().split('T')[0]} required={true} icon={<DateRange />} />
            </Grid>
          );
          Swal.fire({
            title: 'ACTUALIZAR DATOS DEL PRODUCTO',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: async () => {
              const producto_ = productoRef.current.getSelectedProduct();
              const categoria_ = categoriaRef.current.getSelectedRole();
              const precioVenta_ = parseInt(document.getElementById('precioVenta').value);
              const stock_ = parseInt(document.getElementById('stock').value);
              const fecha_ = document.getElementById('fecha').value;
              if(producto_._id === producto._id){
                return{ producto_, categoria_, stock_, precioVenta_, fecha_ };
              }
              else{
                return axios.get(`${UrlReact}/almacen/buscarproducto/${producto_._id}`, configInicial)
                .then(response => {
                  if (response.mensaje === 'Almacen no encontrado') {
                    return { producto_, categoria_, stock_, precioVenta_, fecha_ };
                  } else {
                    CustomSwal({ 
                      icono: 'error', 
                      titulo: 'Error al actualizar el almacén', 
                      mensaje: 'El producto ya está almacenado' 
                    });
                    return false;
                  }
                })
                .catch(error => {
                  return { producto_, categoria_, stock_, precioVenta_, fecha_ };
                });
            }
          },
          customClass: {
            popup: 'customs-swal-popup',
            title: 'customs-swal-title',
            confirmButton: 'swal2-confirm custom-swal2-confirm',
            cancelButton: 'swal2-cancel custom-swal2-cancel',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { producto_, categoria_, stock_, precioVenta_, fecha_ } = result.value;
            axios.put(`${UrlReact}/almacen/actualizar/${_id}`, {
              producto: producto_,
              categoria: categoria_,
              cantidad_stock: stock_,
              precioVenta: precioVenta_, 
              fecha_caducidad: fecha_,
              usuario_actualizacion: usuario_,
            }, configInicial)
            .then((response) => {
              setAlmacen(response.almacenesEncontrados);
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
                      : ''} rows={5}
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
                <CustomActualizarUser number={12} label="Fecha de caducidad" defaultValue={new Date(fecha_caducidad).toISOString().split('T')[0]} readOnly={true} icon={<CalendarMonth />} />
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
