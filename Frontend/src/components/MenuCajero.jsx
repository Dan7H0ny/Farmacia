import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Avatar, Typography, IconButton } from '@mui/material';
import { MonetizationOnOutlined, MeetingRoom, ExpandMore, ExpandLess, PeopleAltOutlined, MenuOutlined, AppRegistrationOutlined, ListAltOutlined, EditOutlined } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAutenticarContexto } from '../contextos/autenticar';
import imagen from '../assets/images/LogoFar.png';
import '../assets/css/menu.css';

export const MenuCajero = () => {
  const navigate = useNavigate();
  const { cerrarSesion } = useAutenticarContexto()
  const _id = localStorage.getItem('id');
  const nombre = localStorage.getItem('nombre');
  const rol = localStorage.getItem('rol');
  const [usuarios, setUsuario] = useState([]);
  const [Cliente, setisCliente] = useState(false);
  const [Venta, setisVenta] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  
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
    if (!token) {
    // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      Logout()
    }
    else{
    axios.get(`http://localhost:4000/usuario/buscar/${_id}`)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { _id, nombre, apellido, rol, direccion, telefono, correo } = response;
    Swal.fire({
      title: 'PERFIL DEL USUARIO',
      html: `
      <style>
        .swal-form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 0px; /* Espacio entre cada grupo */
        }
      
        label {
          margin-bottom: 0px; /* Espacio entre el label y el input */
        }
      </style>
      <div class="swal-form-group">
        <label for="nombre-input">NOMBRE COMPLETO:</label>
        <input type="text" id="nombre-input" value="${nombre}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="apellido-input">APELLIDO COMPLETO:</label>
        <input type="text" id="apellido-input" value="${apellido}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="rol-input">ROL:</label>
        <input type="text" id="rol-input" value="${rol}" class="swal2-input" readonly>
      </div>
      <div class="swal-form-group">
        <label for="direccion-input">DIRECCION:</label>
        <input type="text" id="direccion-input" value="${direccion}" class="swal2-input">
      </div>
      <div class="swal-form-group">
        <label for="telefono-input">TELEFONO:</label>
        <input type="number" id="telefono-input" value="${telefono}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="correo-input">CORREO:</label>
        <input type="email" id="correo-input" value="${correo}" class="swal2-input" readonly>
      </div>
      <div class="swal-form-group">
        <label for="password-input">PASSWORD:</label>
        <input type="password" id="password-input" value="" class="swal2-input">
      </div>
    `,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre_ = Swal.getPopup().querySelector('#nombre-input').value;
        const apellido_ = Swal.getPopup().querySelector('#apellido-input').value;
        const rol_ = Swal.getPopup().querySelector('#rol-input').value;
        const direccion_ = Swal.getPopup().querySelector('#direccion-input').value;
        const telefono_ = parseInt(Swal.getPopup().querySelector('#telefono-input').value);
        const correo_ = Swal.getPopup().querySelector('#correo-input').value;
        let password_ = Swal.getPopup().querySelector('#password-input').value;
        return { nombre_, apellido_, rol_, direccion_, telefono_, correo_, password_ };
      },
      customClass: {
        container: 'my-swal-container', // Clase personalizada para el contenedor principal
      },
      didOpen: () => {
        // Agregar estilos personalizados al contenedor principal
        const container = Swal.getPopup();
        container.style.width = '50%'; // Personalizar el ancho del contenedor
        container.style.padding = '20px'; // Personalizar el padding del contenedor
        container.style.marginRight = '0px'; // Márgen derecho de 100px
        container.style.marginLeft = '0px'; // Márgen izquierdo de 265px
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombre_, apellido_, rol_, direccion_, telefono_, correo_, password_ } = result.value;
        axios
          .put(`http://localhost:4000/usuario/actualizar/${_id}`, {
            nombre: nombre_,
            apellido: apellido_,
            rol: rol_,
            direccion: direccion_,
            telefono: telefono_,
            correo: correo_,
            password: password_,
          })
          .then((response) => {
            const usuariosActualizados = usuarios.map((usuario, index) => {
              if (index === _id) {
                return {
                  ...usuario,
                  nombre: nombre_,
                  apellido: apellido_,
                  rol: rol_,
                  direccion: direccion_,
                  telefono: telefono_,
                  correo: correo_,
                  password: password_,
                };
              } else {
                return usuario;
              }
            });
  
            setUsuario(usuariosActualizados);
            Swal.fire({
              icon: 'success',
              title: 'Usuario actualizado',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar Usuario',
              text: error.mensaje,
            });
          });
      }
    });
    })
    .catch(error => {
      console.log(error.mensaje);
    });
  }
  };
  
  const GetCliente = () => {setisCliente(!Cliente);};
  const GetVenta = () => {setisVenta(!Venta);};

  function RegistrarCliente() {navigate(`/Menu/Cajero/Cliente/Registrar`);}
  function ListarCliente() {navigate(`/Menu/Cajero/Cliente/Listar`);}

  function RegistrarVenta() {navigate(`/Menu/Cajero/Venta/Registrar`);}
  function ListarVenta() {navigate(`/Menu/Cajero/Venta/Listar`);}

  const handleLogout = () => {
    // Llama a la función de logout cuando se haga clic en el botón o enlace de "Cerrar sesión"
    Logout();
  };
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="background-container">
    <div id="caja_menu" style={{ textAlign: 'left' }}>
      <Drawer variant="permanent" open={drawerOpen} sx={{ '& .MuiPaper-root': { backgroundColor: '#000000', color: '#cce6ff'}, '& .MuiListItemIcon-root': {color:'#cce6ff'}, width: drawerOpen ? '300px' : '50px', transition: 'width 0.3s' }}>
        <IconButton onClick={toggleDrawer}>
          <MenuOutlined sx={{ color: '#eeca06' }} />
        </IconButton>
        <List sx={{ width: drawerOpen ? '300px' : '50px', transition: 'width 0.3s' }}>
          {drawerOpen && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
              <img src={imagen} alt="Logo" style={{ maxWidth: '75%', maxHeight: '50%' }} />
            </div>
          )}
          <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#eeca06', width: 30, height: 30, fontSize: 20 }}>{nombre[0]}</Avatar>
              {drawerOpen && (
                <div>
                  <Typography variant="body1" sx={{ color: '#eeca06', fontWeight: 'bold' }}>Nombre: {nombre}</Typography>
                  <Typography variant="body2" sx={{ color: '#eeca06' }}>Rol: {rol}</Typography>
                </div>
              )}
            </div>
            {drawerOpen && (
              <IconButton onClick={botonActualizar}>
                <EditOutlined sx={{ color: '#eeca06 ' }} />
              </IconButton>
            )}
          </ListItem>
          <ListItem button onClick={() => GetCliente(!Cliente)} sx={{ color: '#eeca06 ' }}>
            <ListItemIcon>
              <PeopleAltOutlined sx={{ color: '#eeca06 ' }} />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="GESTIONAR CLIENTE" sx={{ color: '#eeca06 ' }} />}
            {drawerOpen ? (Cliente ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItem>
          <Collapse in={Cliente} timeout="auto" unmountOnExit>
            <ListItem button onClick={RegistrarCliente}>
              <ListItemIcon>
                <AppRegistrationOutlined />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Registrar clientes" />}
            </ListItem>
            <ListItem button onClick={ListarCliente}>
              <ListItemIcon>
                <ListAltOutlined />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Lista de clientes" />}
            </ListItem>
          </Collapse>
          <ListItem button onClick={() => GetVenta(!Venta)} sx={{ color: '#eeca06 ' }}>
            <ListItemIcon>
              <MonetizationOnOutlined sx={{ color: '#eeca06 ' }} />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="GESTIONAR VENTA" sx={{ color: '#eeca06 ' }} />}
            {drawerOpen ? (Venta ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItem>
          <Collapse in={Venta} timeout="auto" unmountOnExit>
            <ListItem button onClick={RegistrarVenta}>
              <ListItemIcon>
                <AppRegistrationOutlined />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Registrar ventas" />}
            </ListItem>
            <ListItem button onClick={ListarVenta}>
              <ListItemIcon>
                <ListAltOutlined />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Lista de ventas" />}
            </ListItem>
          </Collapse>
          <ListItem button onClick={handleLogout} sx={{ color: '#eeca06 ' }}>
            <ListItemIcon>
              <MeetingRoom sx={{ color: '#eeca06 ' }}/>
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="CERRAR SESION" sx={{ color: '#eeca06 ' }}/> }
          </ListItem>
        </List>
      </Drawer>
      <div id="caja_contenido" className={drawerOpen ? 'content-open' : 'content-closed'}>
        {/* Esto renderizará la vista de "Registrar Usuario" u otra vista según la ruta actual */}
        <Outlet/>
      </div>
    </div>
  </div>
  );
};
