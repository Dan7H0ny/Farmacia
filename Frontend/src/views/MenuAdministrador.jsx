import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { Drawer, IconButton, Box, Typography, Grid, Avatar } from '@mui/material';
import { Inventory2Outlined, MonetizationOnOutlined, MeetingRoom, HomeOutlined, PhoneAndroid, PeopleAltOutlined, Password, 
  MenuOutlined, Email, Room, BusinessCenter, PhotoCameraFrontOutlined, ManageAccountsOutlined, SupervisedUserCircle, AppRegistrationOutlined, 
  EditOutlined, Person } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { useAutenticarContexto } from '../contextos/autenticar';
import CustomActualizarUser from '../components/CustomActualizarUser';
import imagen from '../assets/images/LogoFar.png';
import '../assets/css/swalform.css';
import CustomSwal from '../components/CustomSwal';
import CustomMenu from '../components/CustomMenu';

export const MenuAdministrador = () => {
  const navigate = useNavigate();
  const { cerrarSesion } = useAutenticarContexto();
  const _id = localStorage.getItem('id');
  const nombre = localStorage.getItem('nombre');
  const rol = localStorage.getItem('rol');
  const [Usuario, setisUsuario] = useState(false);
  const [Proveedor, setisProveedor] = useState(false);
  const [Cliente, setisCliente] = useState(false);
  const [Complemento, setisComplemento] = useState(false);
  const [Producto, setisProducto] = useState(false);
  const [Venta, setisVenta] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  function Logout() { cerrarSesion(); navigate('/login'); return null }
  const obtenerToken = () => {
    // Obtener el token del local storage
    const token = localStorage.getItem('token');
    return token;
  }; 

  const botonActualizar = () => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    if (!token) {
    // Redirigir al login si el token no existe
      CustomSwal({ icono: 'error', titulo: 'Token invalido', mensaje: "Su token a expirado"});
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`${UrlReact}/usuario/buscar/${_id}`, config)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
      const { _id, nombre, apellido, rol, direccion, telefono, correo } = response;
      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(
        <form >
          <Grid container spacing={2}>
            <CustomActualizarUser number={6} label="Nombre" defaultValue={nombre} readOnly = {true} icon={<Person />} />
            <CustomActualizarUser number={6} label="Apellido" defaultValue={apellido} readOnly = {true} icon={<SupervisedUserCircle />} />
            <CustomActualizarUser number={6} label="Correo" defaultValue={correo} readOnly = {true} icon={<Email />} />
            <CustomActualizarUser number={6} label="Rol" defaultValue={rol} readOnly = {true} icon={<BusinessCenter />} />
            <CustomActualizarUser number={6} id="telefono" label="Telefono" type="number" defaultValue={telefono} required={false} icon={<PhoneAndroid />}/>
            <CustomActualizarUser number={6} id="password" label="Password" type="password" defaultValue={""} required={false} icon={<Password />} />
            <CustomActualizarUser number={12}id="direccion" label="Direccion" type="text" defaultValue={direccion} required={false} icon={<Room />} />
          </Grid>
        </form>
      );
      Swal.fire({
        title: 'DATOS DEL USUARIO',
        html: container,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const telefonoInput = document.getElementById('telefono').value;
          const telefono_ = parseInt(telefonoInput);
          const direccion_ = document.getElementById('direccion').value;
          let password_ = document.getElementById('password').value;
    
          if (isNaN(telefono_) || telefono_ < 60000000 || telefono_ > 79999999) {
            Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un número de teléfono válido </div>');
            return false;
          }
          return { direccion_, telefono_, password_ };
        },
        customClass: {
          popup: 'customs-swal-popup',
          title: 'customs-swal-title',
          confirmButton: 'swal2-confirm custom-swal2-confirm',  
          cancelButton: 'swal2-cancel custom-swal2-cancel',
          validationMessage: 'custom-validation-message'
        },
        didOpen: () => {
          const telefonoInput = document.getElementById('telefono');
          if (telefonoInput) {
            telefonoInput.addEventListener('input', function () {
              this.value = this.value.replace(/[^\d]/g, '');
              if (this.value.length > 8) {
                this.value = this.value.slice(0, 8);
              }
            });
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { direccion_, telefono_, password_ } = result.value;
          axios.put(`${UrlReact}/usuario/actualizarUser/${_id}`, {
            direccion: direccion_,
            telefono: telefono_,
            password: password_,
          })
            .then((response) => {
              CustomSwal({ icono: 'success', titulo: 'Usuario actualizado', mensaje: response.mensaje });
              if(password_){Logout()}
            })
            .catch((error) => {
              CustomSwal({ icono: 'error', titulo: 'Error al actualizar el Usuario', mensaje: error.mensaje });
            });
        }
      });
    })
    .catch(error => {
      CustomSwal({ icono: 'error', titulo: 'No se encontro el usuario', mensaje: error });
    });
}
};
  
  const GetUsuario = () => {setisUsuario(!Usuario);};
  const GetProveedor = () => {setisProveedor(!Proveedor);};
  const GetCliente = () => {setisCliente(!Cliente);};
  const GetComplemento = () => {setisComplemento(!Complemento);};
  const GetProducto = () => {setisProducto(!Producto);};
  const GetVenta = () => {setisVenta(!Venta);};

  function Dashboard() {navigate(`/Menu/Administrador/Dashboard`);}

  function RegistrarUsuario() {navigate(`/Menu/Administrador/Usuario/Registrar`);}
  function ListarUsuario() {navigate(`/Menu/Administrador/Usuario/Listar`);}

  function RegistrarCliente() {navigate(`/Menu/Administrador/Cliente/Registrar`);}
  function ListarCliente() {navigate(`/Menu/Administrador/Cliente/Listar`);}

  function RegistrarProveedor() {navigate(`/Menu/Administrador/Proveedor/Registrar`);}
  function ListarProveedor() {navigate(`/Menu/Administrador/Proveedor/Listar`);}

  function RegistrarComplemento() {navigate(`/Menu/Administrador/Complemento/Registrar`);}

  function RegistrarProducto() {navigate(`/Menu/Administrador/Producto/Registrar`);}
  function ListarProducto() {navigate(`/Menu/Administrador/Producto/Listar`);}

  function RegistrarVenta() {navigate(`/Menu/Administrador/Venta/Registrar`);}
  function ListarVenta() {navigate(`/Menu/Administrador/Venta/Listar`);}

  const handleLogout = () => {Logout(); };
  const toggleDrawer = () => { setDrawerOpen(!drawerOpen); };
  const toggleUsuario = () => { GetUsuario(!Usuario);};
  const toggleProveedor = () => { GetProveedor(!Proveedor);};
  const toggleCliente = () => { GetCliente(!Cliente);};
  const toggleComplemento = () => { GetComplemento(!Complemento);};
  const toggleProducto = () => { GetProducto(!Producto);};
  const toggleVenta = () => { GetVenta(!Venta);};

  const drawerClass = drawerOpen ? 'custom-drawer' : 'custom-drawer drawer-closed';

  return (
  <div className={`background-container-menu`}>
    <div id="caja_menu" style={{ textAlign: 'left', width: '95%'}}>
      <Drawer variant="permanent" open={drawerOpen} className={drawerClass} >
        {drawerOpen && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5%', backgroundColor: '#e2e2e2' }}>
            <img src={imagen} alt="Logo" style={{ maxWidth: '100%', maxHeight: '80%' }} />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e2e2' }}>
          <IconButton onClick={toggleDrawer} sx={{ width: drawerOpen ? '25%' : '100%', transition: 'width 0.3s' }}>
            <MenuOutlined sx={{ color: '#e2e2e2' }} />
          </IconButton>
          {drawerOpen &&
          <>
            <IconButton onClick={botonActualizar} sx={{ width: drawerOpen ? '25%' : '100%', transition: 'width 0.3s' }}>
              <EditOutlined sx={{ color: '#e2e2e2' }} />
            </IconButton>
            <IconButton onClick={Dashboard} sx={{ width: drawerOpen ? '25%' : '100%', transition: 'width 0.3s' }}>
              <HomeOutlined sx={{ color: '#e2e2e2' }} />
            </IconButton>
          </>
          }
        </div>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CustomMenu itemName={"Usuario"} itemOpen={Usuario} BtnMostrar={toggleUsuario} BtnRegistrar={RegistrarUsuario} BtnListar={ListarUsuario} drawerOpen={drawerOpen} icon={<PeopleAltOutlined />}/>
          <CustomMenu itemName={"Proveedor"} itemOpen={Proveedor} BtnMostrar={toggleProveedor} BtnRegistrar={RegistrarProveedor} BtnListar={ListarProveedor} drawerOpen={drawerOpen} icon={<ManageAccountsOutlined />}/>
          <CustomMenu itemName={"Cliente"} itemOpen={Cliente} BtnMostrar={toggleCliente} BtnRegistrar={RegistrarCliente} BtnListar={ListarCliente} drawerOpen={drawerOpen} icon={<PhotoCameraFrontOutlined />}/>
          <CustomMenu itemName={"Complementos"} itemOpen={Complemento} BtnMostrar={toggleComplemento} BtnRegistrar={RegistrarComplemento} drawerOpen={drawerOpen} icon={<Inventory2Outlined />}/>
          <CustomMenu itemName={"Producto"} itemOpen={Producto} BtnMostrar={toggleProducto} BtnRegistrar={RegistrarProducto} BtnListar={ListarProducto} drawerOpen={drawerOpen} icon={<AppRegistrationOutlined />}/>
          <CustomMenu itemName={"Venta"} itemOpen={Venta} BtnMostrar={toggleVenta} BtnRegistrar={RegistrarVenta} BtnListar={ListarVenta} drawerOpen={drawerOpen} icon={<MonetizationOnOutlined />}/>
        </div>
        <Box className='border' sx={{ border: '1px solid #e2e2e2', padding: '10px', display: 'flex', alignItems: 'flex-start', justifyContent: drawerOpen ? 'space-between':'center' }}>
          {drawerOpen && (
            <Avatar sx={{ bgcolor: '#e2e2e2', color: '#0f1b35', marginRight: drawerOpen ? 2 : 0 }}>{nombre.charAt(0)}</Avatar>
          )}
            {drawerOpen && (
              <Box sx={{ display: 'flex', flexDirection: 'column', color: '#e2e2e2', alignItems: 'flex-start' }}>
                <Typography>Nombre: {nombre}</Typography>
                <Typography>Rol: {rol}</Typography>
              </Box>
            )}
          <IconButton onClick={handleLogout} sx={{ color: '#e2e2e2' }}>
            <MeetingRoom />
          </IconButton>
        </Box>
      </Drawer>
      <div id="caja_contenido" className={drawerOpen ? 'content-open' : 'content-closed'}>
        {/* Esto renderizará la vista de "Registrar Usuario" u otra vista según la ruta actual */}
        <Outlet/>
      </div>
    </div>
  </div>
  );
};
