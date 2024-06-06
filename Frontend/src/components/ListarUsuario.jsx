import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Visibility, Update} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../assets/css/listarUsuario.css';

export const ListarUsuario = () => {
  const [usuarios, setUsuario] = useState([]);
  const navigate = useNavigate();
  const obtenerToken = () => {
    // Obtener el token del local storage
    const token = localStorage.getItem('token');
    return token;
  }; 
  const roles = [
    { nombre: 'Administrador' },
    { nombre: 'Cajero' },
  ];
  const token = obtenerToken();
  const configInicial = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  useEffect(() => {
    const token = obtenerToken();
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "Error al obtener el token de acceso",
      });
      navigate('/Menu/Administrador')
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.get('http://localhost:4000/usuario/mostrar', config)
      .then(response => {
        const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
        if (!token) {
          // Redirigir al login si el token no existe
          Swal.fire({
            icon: 'error',
            title: 'El token es invalido',
            text: "error",
          });
          navigate('/Menu/Administrador')
        }
        else
        {
          setUsuario(response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate]);

  const botonActualizar = (miIndex) => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
    // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador')
    }
    else{
    const UsuarioActual = usuarios[miIndex];
    axios.get(`http://localhost:4000/usuario/buscar/${UsuarioActual._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { _id, nombre, apellido, rol, direccion, telefono, correo } = response;
    Swal.fire({
      title: 'ACTUALIZAR AL USUARIO',
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
        <label for="nombre-input">Nombre del usuario:</label>
        <input type="text" id="nombre-input" value="${nombre}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="apellido-input">Apellido del usuario:</label>
        <input type="text" id="apellido-input" value="${apellido}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="direccion-input">Direccion del usuario:</label>
        <input type="text" id="direccion-input" value="${direccion}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="telefono-input">Telefono del usuario:</label>
        <input type="number" id="telefono-input" value="${telefono}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="correo-input">Correo del usuario:</label>
        <input type="email" id="correo-input" value="${correo}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="password-input">Password del usuario:</label>
        <input type="password" id="password-input" value="" class="swal2-input" >
      </div>
      <div class="swal-form-group">
        <label for="rol-input">Rol del usuario:</label>
        <select type="text" id="rol-input" class="swal2-input" required>
        ${roles.map((rols) => `
          <option value="${rols.nombre}" ${rols.nombre === rol ? 'selected' : ''}>${rols.nombre}</option>
        `)}
        </select>
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
        const direccion_ = Swal.getPopup().querySelector('#direccion-input').value;
        const telefono_ = parseInt(Swal.getPopup().querySelector('#telefono-input').value);
        const correo_ = Swal.getPopup().querySelector('#correo-input').value;
        let password_ = Swal.getPopup().querySelector('#password-input').value;
        const rol_ = Swal.getPopup().querySelector('#rol-input').value;
        return { nombre_, apellido_, direccion_, telefono_, correo_, password_, rol_ };
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
        const { nombre_, apellido_, direccion_, telefono_, correo_, password_, rol_  } = result.value;
        axios.put(`http://localhost:4000/usuario/actualizar/${_id}`, {
            nombre: nombre_,
            apellido: apellido_,
            direccion: direccion_,
            telefono: telefono_,
            correo: correo_,
            password: password_,
            rol: rol_,
          }, configInicial)
          .then((response) => {
            const usuariosActualizados = usuarios.map((usuario, index) => {
              if (index === miIndex) {
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
    });
    })
    .catch(error => {
      console.log(error.mensaje);
    });
  }
  };
  
  const botonMostrar = (miIndex) => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
    // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador')
    }
    else{
    const UsuarioActual = usuarios[miIndex];
    axios.get(`http://localhost:4000/usuario/buscar/${UsuarioActual._id}`, configInicial)
    .then(response => {
    // Acciones a realizar con los datos del usuario encontrado
    const { _id, nombre, apellido, rol, direccion, telefono, correo } = response;
    console.log(_id)
    Swal.fire({
      title: 'MOSTRAR USUARIO',
      html: `
      <style>
        .swal-form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 5px; /* Espacio entre cada grupo */
        }
      
        label {
          margin-bottom: 5px; /* Espacio entre el label y el input */
        }
      </style>
      <div class="swal-form-group">
        <label for="nombre-input">Nombre completo del Usuario:</label>
        <input type="text" id="nombre-input" value="${nombre}" class="swal2-input" readonly>
      </div>
      <div class="swal-form-group">
        <label for="apellido-input">Apellido completo del usuario:</label>
        <input type="text" id="apellido-input" value="${apellido}" class="swal2-input" readonly>
      </div>
      <div class="swal-form-group">
        <label for="direccion-input">Direccion del usuario:</label>
        <input type="text" id="direccion-input" value="${direccion}" class="swal2-input" readonly>
      </div>
      <div class="swal-form-group">
        <label for="telefono-input">Telefono del usuario:</label>
        <input type="number" id="telefono-input" value="${telefono}" class="swal2-input" readonly>
      </div>
      <div class="swal-form-group">
        <label for="correo-input">Correo del usuario:</label>
        <input type="email" id="correo-input" value="${correo}" class="swal2-input" readonly>
      </div>
      <div class="swal-form-group">
        <label for="rol-input">Rol del usuario:</label>
        <input type="text" id="rol-input" value="${rol}" class="swal2-input" readonly>
      </div>
    `,
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: '<i class="bi bi-trash3-fill"></i> Eliminar',
        cancelButtonText: 'Cancelar',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-danger me-2',
          container: 'my-swal-container',
          cancelButton: 'btn btn-secondary',
        },
        didOpen: () => {
          // Agregar estilos personalizados al contenedor principal
          const container = Swal.getPopup();
          container.style.width = '50%'; // Personalizar el ancho del contenedor
          container.style.padding = '20px'; // Personalizar el padding del contenedor
          container.style.marginRight = '100px'; // Márgen derecho de 100px
          container.style.marginLeft = '330px'; // Márgen izquierdo de 265px
        },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:4000/usuario/eliminar/${_id}`, configInicial)
          .then((response) => {
            const UsuariosActualizados = usuarios.filter((e, index) => index !== miIndex);
  
            setUsuario(UsuariosActualizados);
            Swal.fire({
              icon: 'success',
              title: 'Usuario eliminado',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el usuario',
              text: error.mensaje,
            });
          });
      }
    });
    })
    .catch(error => {
      console.log(error.response.data.mensaje);
    });
  }
  };

  return (
    <div id="usuarioListar" style={{ textAlign: 'left',marginRight: '10px',marginLeft:'10px'}}>
      <Typography variant="h6" component="div" style={{ marginTop: 0, textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a", paddingLeft: '280px', paddingRight: '280px' }}>
        LISTA DE USUARIOS
      </Typography>
      <div className="table-responsive">
        {
          <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              <TableRow >
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Actualizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              {usuarios.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{x.nombre}</TableCell>
                  <TableCell>{x.apellido}</TableCell>
                  <TableCell>{x.rol}</TableCell>
                  <TableCell>{x.correo}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" onClick={() => botonMostrar(index) }>
                      <Visibility />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" color="success" onClick={() => botonActualizar(index)}>
                      <Update  />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </div>
    </div>
  )
}
