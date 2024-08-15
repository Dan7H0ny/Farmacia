import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { Drawer, IconButton, Grid, Box, Typography, Avatar } from '@mui/material';
import { AttachMoney, MeetingRoom, HomeOutlined, PhoneAndroid, Password, MenuOutlined, Email, Room, BusinessCenter, SupervisedUserCircle, Person } from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { useAutenticarContexto } from '../contextos/autenticar';
import CustomActualizarUser from '../components/CustomActualizarUser';
import imagen from '../assets/images/LogoFar.png';
import '../assets/css/swalform.css';
import CustomSwal from '../components/CustomSwal';
import CustomMenuVentas from '../components/CustomMenuVentas';
import InfoFarmacia from '../components/InfoFarmacia'

export const MenuCajero = () => {
  const navigate = useNavigate();
  const { cerrarSesion } = useAutenticarContexto()
  const _id = localStorage.getItem('id');
  const nombre = localStorage.getItem('nombre');
  const rol = localStorage.getItem('rol');
  const [Venta, setisVenta] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const location = useLocation();
  const rutaDashboard = location.pathname === '/Menu/Cajero';
  
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  function Logout() {
    cerrarSesion()
    navigate('/login')
    return null
  }
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
        <Grid container spacing={2}>
          <CustomActualizarUser number={6} label="Nombre" defaultValue={nombre} readOnly = {true} icon={<Person />} />
          <CustomActualizarUser number={6} label="Apellido" defaultValue={apellido} readOnly = {true} icon={<SupervisedUserCircle />} />
          <CustomActualizarUser number={6} label="Correo" defaultValue={correo} readOnly = {true} icon={<Email />} />
          <CustomActualizarUser number={6} label="Rol" defaultValue={rol} readOnly = {true} icon={<BusinessCenter />} />
          <CustomActualizarUser number={6} id="telefono" label="Telefono" type="number" defaultValue={telefono} required={false} icon={<PhoneAndroid />} />
          <CustomActualizarUser number={6} id="password" label="Password" type="password" defaultValue={""} required={false} icon={<Password />} />
          <CustomActualizarUser number={12}id="direccion" label="Direccion" type="text" defaultValue={direccion} required={false} icon={<Room />} />
        </Grid>
      );
      Swal.fire({
        title: 'PERFIL DEL USUARIO',
        html: container,
        showCancelButton: true,
        confirmButtonColor: '#e0ffff',
        cancelButtonColor: '#e0ffff',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const direccion_ = document.getElementById('direccion').value;
          const telefono_ = parseInt(document.getElementById('telefono').value);
          let password_ = document.getElementById('password').value;
          return { direccion_, telefono_, password_ };
        },
        customClass: {
          popup: 'customs-swal-popup',
          title: 'customs-swal-title',
          confirmButton: 'swal2-confirm custom-swal2-confirm',  
          cancelButton: 'swal2-cancel custom-swal2-cancel',
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
  const GetVenta = () => {setisVenta(!Venta);};

  function Home() {navigate(`/Menu/Cajero`);}

  function ListarCliente() {navigate(`/Menu/Cajero/Cliente/Listar`);}

  function RegistrarVenta() {navigate(`/Menu/Cajero/Venta/Registrar`);}
  function ListarVenta() {navigate(`/Menu/Cajero/Venta/Listar`);}

  const handleLogout = () => {
    // Llama a la función de logout cuando se haga clic en el botón o enlace de "Cerrar sesión"
    Logout();
  };
  const toggleDrawer = () => { setDrawerOpen(!drawerOpen); };
  const cambioVenta = () => { GetVenta(!Venta);};

  const drawerClass = drawerOpen ? 'custom-drawer' : 'custom-drawer drawer-closed';

  return (
    <div className={`background-container-menu`}>
    <div id="caja_menu" style={{ textAlign: 'left', width: '95%', overflowY: 'auto', maxHeight: '100vh'}}>
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
            <IconButton onClick={Home} sx={{ width: drawerOpen ? '25%' : '100%', transition: 'width 0.3s' }}>
              <HomeOutlined sx={{ color: '#e2e2e2' }} />
            </IconButton>
          </>
          }
        </div>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CustomMenuVentas itemName={"Gestion de ventas"} itemOpen={Venta} BtnMostrar={cambioVenta} 
            BtnRegistrar1={RegistrarVenta} BtnListar1={ListarVenta} nombreBtn1={"Ventas"} 
            BtnListar2={ListarCliente} nombreBtn2={"Clientes"}
            drawerOpen={drawerOpen} icon={<AttachMoney />} />
        </div>
        <Box className='border' sx={{ border: '1px solid #e2e2e2', padding: '10px', display: 'flex', alignItems: 'flex-start', justifyContent: drawerOpen ? 'space-between':'center' }}>
          {drawerOpen && (
            <IconButton onClick={botonActualizar} sx={{ marginRight: drawerOpen ? 2 : 0 }}>
              <Avatar sx={{ bgcolor: '#e2e2e2', color: '#0f1b35' }}>
                {nombre.charAt(0)}
              </Avatar>
            </IconButton>
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
        {rutaDashboard && <InfoFarmacia/>}
        <Outlet/>
      </div>
    </div>
  </div>
  );
};
