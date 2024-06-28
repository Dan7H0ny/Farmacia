import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, IconButton, Grid, AppBar, Toolbar, Button, Menu, MenuItem, Container } from '@mui/material';
import { Inventory2Outlined, MonetizationOnOutlined, MeetingRoom, HomeOutlined, PhoneAndroid, PeopleAltOutlined, Password, MenuOutlined, Email, Room, BusinessCenter, PhotoCameraFrontOutlined, ManageAccountsOutlined, SupervisedUserCircle, AppRegistrationOutlined, EditOutlined, Person } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { useAutenticarContexto } from '../contextos/autenticar';
import CustomActualizarUser from '../components/CustomActualizarUser';
import imagen from '../assets/images/LogoFar.png';
import '../assets/css/menu.css';
import '../assets/css/swal.css';
import '../assets/css/swalform.css';
import CustomSwal from '../components/CustomSwal';
import CustomMenu from '../components/CustomMenu';

export const MenuAdministrador = () => {
  const navigate = useNavigate();
  const { cerrarSesion } = useAutenticarContexto()
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
    axios.get(`http://localhost:4000/usuario/buscar/${_id}`, config)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
      const { _id, nombre, apellido, rol, direccion, telefono, correo } = response;
      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(
        <Grid container spacing={2}>
          <CustomActualizarUser number="6" label="Nombre" defaultValue={nombre} readOnly = {true} icon={<Person />} />
          <CustomActualizarUser number="6" label="Apellido" defaultValue={apellido} readOnly = {true} icon={<SupervisedUserCircle />} />
          <CustomActualizarUser number="6" label="Correo" defaultValue={correo} readOnly = {true} icon={<Email />} />
          <CustomActualizarUser number="6" label="Rol" defaultValue={rol} readOnly = {true} icon={<BusinessCenter />} />
          <CustomActualizarUser number="6" id="telefono" label="Telefono" type="number" defaultValue={telefono} required={false} icon={<PhoneAndroid />} />
          <CustomActualizarUser number="6" id="password" label="Password" type="password" defaultValue={""} required={false} icon={<Password />} />
          <CustomActualizarUser number="12"id="direccion" label="Direccion" type="text" defaultValue={direccion} required={false} icon={<Room />} />
        </Grid>
      );
      Swal.fire({
        title: 'DATOS DEL USUARIO',
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
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          confirmButton: 'swal2-confirm custom-swal2-confirm',  
          cancelButton: 'custom-swal2-cancel'
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
          axios.put(`http://localhost:4000/usuario/actualizarUser/${_id}`, {
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

  const handleLogout = () => {
    // Llama a la función de logout cuando se haga clic en el botón o enlace de "Cerrar sesión"
    Logout();
  };
  const toggleDrawer = () => { setDrawerOpen(!drawerOpen); };
  const toggleUsuario = () => { GetUsuario(!Usuario);};
  const toggleProveedor = () => { GetProveedor(!Proveedor);};
  const toggleCliente = () => { GetCliente(!Cliente);};
  const toggleComplemento = () => { GetComplemento(!Complemento);};
  const toggleProducto = () => { GetProducto(!Producto);};
  const toggleVenta = () => { GetVenta(!Venta);};


  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={`background-container-menu`}>
    <div id="caja_menu" style={{ textAlign: 'left'}}>
      <Drawer variant="permanent" open={drawerOpen} sx={{ '& .MuiPaper-root': { backgroundColor: '#000000', color: '#cce6ff', width: drawerOpen ? '20%' : '3%', transition: 'width 0.3s'}, '& .MuiListItemIcon-root': {color:'#cce6ff'},'& .MuiList-root': {width: drawerOpen ? '100%' : '0%', transition: 'width 0.3s' }}}>
        <IconButton onClick={toggleDrawer} sx={{ width: drawerOpen ? '15%' : '100%', transition: 'width 0.3s'  }}>
          <MenuOutlined sx={{ color: '#eeca06' }} />
        </IconButton>
        <List sx={{ width: drawerOpen ? '100%' : '0%', transition: 'width 0.3s' }}>
          {drawerOpen && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
              <img src={imagen} alt="Logo" style={{ maxWidth: '75%', maxHeight: '50%' }} />
            </div>
          )}
          <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#eeca06', width: 30, height: 30, fontSize: 20, marginRight: '14%' }}>{nombre[0]}</Avatar>
              {drawerOpen && (
                <div>
                  <Typography variant="body1" sx={{ color: '#eeca06', fontWeight: 'bold' }}>Nombre: {nombre}</Typography>
                  <Typography variant="body2" sx={{ color: '#eeca06' }}>Rol: {rol}</Typography>
                </div>
              )}
            </div>
            {drawerOpen && (
              <IconButton onClick={botonActualizar}>
                <EditOutlined sx={{ color: '#eeca06 ', marginLeft: '250%'}} />
              </IconButton>
            )}
            {drawerOpen && (
                <IconButton onClick={Dashboard}>
                  <HomeOutlined sx={{ color: '#eeca06 ', marginLeft: '10%' }} />
                </IconButton>
              )}
          </ListItem>
          <CustomMenu itemName={"Usuario"} itemOpen={Usuario} BtnMostrar={toggleUsuario} BtnRegistrar={RegistrarUsuario} BtnListar={ListarUsuario} drawerOpen={drawerOpen} icon={<PeopleAltOutlined sx={{ color: '#eeca06' }} />}/>
          <CustomMenu itemName={"Proveedor"} itemOpen={Proveedor} BtnMostrar={toggleProveedor} BtnRegistrar={RegistrarProveedor} BtnListar={ListarProveedor} drawerOpen={drawerOpen} icon={<ManageAccountsOutlined sx={{ color: '#eeca06' }}/>}/>
          <CustomMenu itemName={"Cliente"} itemOpen={Cliente} BtnMostrar={toggleCliente} BtnRegistrar={RegistrarCliente} BtnListar={ListarCliente} drawerOpen={drawerOpen} icon={<PhotoCameraFrontOutlined sx={{ color: '#eeca06' }}/>}/>
          <CustomMenu itemName={"Complementos"} itemOpen={Complemento} BtnMostrar={toggleComplemento} BtnRegistrar={RegistrarComplemento} drawerOpen={drawerOpen} icon={<Inventory2Outlined sx={{ color: '#eeca06' }}/>}/>
          <CustomMenu itemName={"Producto"} itemOpen={Producto} BtnMostrar={toggleProducto} BtnRegistrar={RegistrarProducto} BtnListar={ListarProducto} drawerOpen={drawerOpen} icon={<AppRegistrationOutlined sx={{ color: '#eeca06' }}/>}/>
          <CustomMenu itemName={"Venta"} itemOpen={Venta} BtnMostrar={toggleVenta} BtnRegistrar={RegistrarVenta} BtnListar={ListarVenta} drawerOpen={drawerOpen} icon={<MonetizationOnOutlined sx={{ color: '#eeca06' }}/>}/>
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
      <AppBar position="static">
      <Container>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ mr: 2 }}
          >
            <HomeOutlined />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mi Aplicación
          </Typography>
          <Button color="inherit">Inicio</Button>
          <Button color="inherit">Acerca de</Button>
          <Button color="inherit">Contacto</Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
            <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
            <MenuItem onClick={handleMenuClose}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
    </div>
  </div>
  );
};
