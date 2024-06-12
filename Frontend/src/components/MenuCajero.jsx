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
      Swal.fire({icon: 'error',title: 'El token es invalido',text: "error",});
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`http://localhost:4000/usuario/buscar/${_id}`)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
      const { _id, nombre, apellido, rol, direccion, telefono, correo } = response;

      const table = document.createElement('table');
      table.innerHTML = `
      <style>
        .swal-form-group {
          display: flex;
          flex-direction: wrap;
          margin-bottom: 0px;
          justify-content: space-between;
        }
        label {margin-right: 10px; font-weight: bold; }
        td {padding-right: 10px; text-align: left; }
      </style>
          <tr>
              <td><strong>Nombre del usuario:</strong></td>
              <td contenteditable="false" id="nombre">${nombre}</td>
          </tr>
          <tr>
              <td><strong>Apellido del usuario:</strong></td>
              <td contenteditable="false" id="apellido">${apellido}</td>
          </tr>
          <tr>
              <td><strong>Dirección del usuario:</strong></td>
              <td contenteditable="true" id="direccion">${direccion}</td>
          </tr>
          <tr>
              <td><strong>Teléfono del usuario:</strong></td>
              <td contenteditable="true" id="telefono">${telefono}</td>
          </tr>
          <tr>
              <td><strong>Correo del usuario:</strong></td>
              <td contenteditable="false" id="correo">${correo}</td>
          </tr>
          <tr>
              <td><strong>Contraseña del usuario:</strong></td>
              <td contenteditable="true" id="password"></td>
          </tr>
          <tr>
              <td><strong>Rol del usuario:</strong></td>
              <td contenteditable="false" id="rol">${rol}</td>
          </tr>
      `;
      Swal.fire({
          title: 'ACTUALIZAR AL USUARIO',
          html: table,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
              const nombre_ = document.getElementById('nombre').textContent;
              const apellido_ = document.getElementById('apellido').textContent;
              const direccion_ = document.getElementById('direccion').textContent;
              const telefono_ = parseInt(document.getElementById('telefono').textContent);
              const correo_ = document.getElementById('correo').textContent;
              const rol_ = document.getElementById('rol').textContent;
              let password_ = document.getElementById('password').textContent;
              return { nombre_, apellido_, direccion_, telefono_, correo_, rol_, password_ };
          },
          customClass: {
              container: 'my-swal-container', // Clase personalizada para el contenedor principal
          },
          didOpen: () => {
            const nombreInput = document.getElementById('nombre');
            const apellidoInput = document.getElementById('apellido');
            const telefonoInput = document.getElementById('telefono');

            nombreInput.addEventListener('input', function () {
              this.textContent = this.textContent.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
            });
            apellidoInput.addEventListener('input', function () {
              this.textContent = this.textContent.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
            });
            telefonoInput.addEventListener('input', function () {
            if (typeof this.textContent !== 'undefined') {
            // Eliminar cualquier carácter que no sea un dígito
              this.textContent = this.textContent.replace(/[^\d]/g, '');
              // Verificar si el número tiene más de 8 dígitos
                if (this.textContent.length > 8) {
                // Si tiene más de 8 dígitos, truncar el valor a 8 dígitos
                  this.textContent = this.textContent.slice(0, 8);
                }
              }
          });    
              // Agregar estilos personalizados al contenedor principal
              const container = Swal.getPopup();
              container.style.width = '40%'; // Personalizar el ancho del contenedor
              container.style.padding = '20px'; // Personalizar el padding del contenedor
              container.style.marginRight = '0%'; // Márgen derecho de 100px
              container.style.marginLeft = '0px'; // Márgen izquierdo de 265px
          },
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        const { nombre_, apellido_, direccion_, telefono_, correo_, password_, rol_  } = result.value;
        if (telefono_ >= 60000000 && telefono_ <= 79999999) {
        axios.put(`http://localhost:4000/usuario/actualizar/${_id}`, {
            nombre: nombre_,
            apellido: apellido_,
            direccion: direccion_,
            telefono: telefono_,
            correo: correo_,
            password: password_,
            rol: rol_,
          })
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
            Swal.fire({
              icon: 'success',
              title: 'Usuario actualizado',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar el Usuario',
              text: error.mensaje,
            });
          });
        }
        else {
          // Si el número de teléfono no está dentro del rango permitido, mostrar un mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El número de teléfono debe estar entre 60000000 y 79999999',
          });
        }
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
