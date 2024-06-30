import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid,TablePagination,InputAdornment, TextField, Switch  } from '@mui/material';
import { Visibility, ModeEdit, Search} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../assets/css/listarUsuario.css';
import styled from 'styled-components';

const CustomSwitch = styled(Switch)`
  .MuiSwitch-switchBase.Mui-checked {
    color: #eeca06;
  }
  .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    background-color: #eeca06;
  }
`;

export const ListarUsuario = () => {
  const [usuarios, setUsuario] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const roles = [{ nombre: 'Administrador' }, { nombre: 'Cajero' }, ];
  const token = obtenerToken();
  const configInicial = { headers: { Authorization: `Bearer ${token}` }};
  useEffect(() => {
    const token = obtenerToken();
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({icon: 'error',title: 'El token es invalido',text: "Error al obtener el token de acceso",});
      navigate('/Menu/Administrador')
      return;
    }
    const config = {headers: {Authorization: `Bearer ${token}`}};
    axios.get('http://localhost:4000/usuario/mostrar', config)
      .then(response => {
        const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
        if (!token) {
          // Redirigir al login si el token no existe
          Swal.fire({icon: 'error',title: 'El token es invalido',text: "error",});
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

  const botonActualizar = (usuario) => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
    // Redirigir al login si el token no existe
      Swal.fire({icon: 'error',title: 'El token es invalido',text: "error",});
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`http://localhost:4000/usuario/buscar/${usuario._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
      const { _id, nombre, apellido, rol, direccion, telefono, correo } = response;
      const selectOptions = roles.map(rols => `
        <option value="${rols.nombre}" ${rols.nombre === rol ? 'selected' : ''}>${rols.nombre}</option>
      `).join('');

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
              <td contenteditable="true" id="nombre">${nombre}</td>
          </tr>
          <tr>
              <td><strong>Apellido del usuario:</strong></td>
              <td contenteditable="true" id="apellido">${apellido}</td>
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
              <td contenteditable="true" id="correo">${correo}</td>
          </tr>
          <tr>
              <td><strong>Contraseña del usuario:</strong></td>
              <td contenteditable="true" id="password"></td>
          </tr>
          <tr>
            <td><strong>Rol del usuario:</strong></td>
              <td>
                <select id="rol">
                  ${selectOptions}
                </select>
              </td>
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
              const rol_ = document.getElementById('rol').value;
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
          }, configInicial)
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

  const botonMostrar = (cliente) => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`http://localhost:4000/usuario/buscar/${cliente._id}`, configInicial)
        .then(response => {
          // Acciones a realizar con los datos del usuario encontrado
          const { nombre, apellido, rol, direccion, telefono, correo, estado, fecha_registro, fecha_actualizacion } = response;
          const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
          const fechaActualizacion = fecha_actualizacion ? formatDateTime(new Date(fecha_actualizacion)) : '';

          function formatDateTime(date) {
              const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
              const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
              const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
              const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
              return `${formattedDate} ${formattedTime}`;
          }
          const iconoEstado = estado ? '<i class="fas fa-check-circle" style="color:green"></i>' : '<i class="fas fa-times-circle" style="color:red"></i>';
          Swal.fire({
            title: 'MOSTRAR USUARIO',
            html: `
            <style>
                .swal-form-group {
                  display: flex;
                  flex-direction: wrap;
                  margin-bottom: 0px;
                  justify-content: space-between;
                }
                label {
                  margin-right: 10px; /* Espacio entre el label y el input */
                  font-weight: bold; /* Hacer el texto del label en negrita */
                }
                td {
                  padding-right: 10px; /* Espacio entre el texto y el borde derecho de la celda */
                  text-align: left; /* Alinear el texto a la izquierda */
                }
              </style>
              <table>
              <tr>
                <td><strong>Nombre Completo del Usuario:</strong></td>
                <td>${nombre}</td>
              </tr>
              <tr>
                <td><strong>Apellido completo del Usuario:</strong></td>
                <td>${apellido}</td>
              </tr>
              <tr>
                <td><strong>Dirección del usuario:</strong></td>
                <td>${direccion}</td>
              </tr>
              <tr>
                <td><strong>Teléfono del usuario:</strong></td>
                <td>${telefono}</td>
              </tr>
              <tr>
                <td><strong>Correo del usuario:</strong></td>
                <td>${correo}</td>
              </tr>
              <tr>
                <td><strong>Rol del usuario:</strong></td>
                <td>${rol}</td>
              </tr>
              <tr>
                <td><strong>Estado del usuario:</strong></td>
                <td>${iconoEstado}</td>
              </tr>
               <tr>
                <td><strong>Fecha de registro del usuario:</strong></td>
                <td>${fechaRegistro}</td>
              </tr>
               <tr>
                <td><strong>Fecha de actualizacion del usuario:</strong></td>
                <td>${fechaActualizacion}</td>
              </tr>
            </table>
            `,
            showCancelButton: false,
            confirmButtonText: 'Volver',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary',
              container: 'my-swal-container'
            },
            didOpen: () => {
              // Agregar estilos personalizados al contenedor principal
              const container = Swal.getPopup();
              container.style.width = '50%'; // Personalizar el ancho del contenedor
              container.style.padding = '20px'; // Personalizar el padding del contenedor
              container.style.marginRight = '100px'; // Márgen derecho de 100px
              container.style.marginLeft = '330px'; // Márgen izquierdo de 265px
            }
          });
        })
        .catch(error => {
          console.log(error.response.data.mensaje);
        });
    }
  };  

  const handleSwitchChange = async (event, id, estado) => {
    const nuevoEstado = event.target.checked ? true : false;
    try {
      await axios.put(`http://localhost:4000/cliente/eliminar/${id}`, { estado: nuevoEstado }, configInicial);
      setUsuario((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario._id === id ? { ...usuario, estado: nuevoEstado } : usuario
        )
      );
      Swal.fire({
        icon: 'success',
        title: 'Estado Actualizado',
        text: 'El usuario a cambiado de estado ahora esta: ' + (nuevoEstado ? 'activo' : 'inactivo'),
      });    
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filtrarUsuario = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(buscar.toLowerCase())
  );  

  const paginatedClientes = filtrarUsuario.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  return (
    <div id="caja_contenido" >
      <Typography variant="h6" style={{ marginTop: 10, textAlign: 'center',fontSize: '50px', fontWeight:'1000', color: '#eeca06', backgroundColor: "#03112a"}}>
        Lista De Los Usuarios
      </Typography>
      <Grid item xs={12} sm={4} sx={{marginTop: 2, '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
      <TextField
        label="Nombre del usuario"
        variant="outlined"
        fullWidth
        size="large"
        type='text'
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        required
        InputProps={{
        sx: { color: '#eeca06' },
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#eeca06' }} />
            </InputAdornment>
            ),
          }}
        InputLabelProps={{ sx: { color: '#eeca06' } }} />
    </Grid>
      <div className="table-responsive">
          <Table className="table table-bordered table-hover"  style={{ marginTop: 10 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center'} }}>
              <TableRow >
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              {paginatedClientes.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                  <TableCell>{x.nombre}</TableCell>
                  <TableCell>{x.apellido}</TableCell>
                  <TableCell>{x.rol}</TableCell>
                  <TableCell>{x.correo}</TableCell>
                  <TableCell className="text-center">
                    <CustomSwitch
                      checked={x.estado === true}
                      onChange={(event) => handleSwitchChange(event, x._id, x.estado)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" onClick={() => botonMostrar(x) }>
                      <Visibility />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" color="success" onClick={() => botonActualizar(x)}>
                      <ModeEdit  />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Grid item xs={12} sm={4} sx={{ marginTop: 2, '& .MuiTextField-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
            <TablePagination
              component="div"
              count={filtrarUsuario.length}
              page={currentPage}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por por pagina"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              rowsPerPageOptions={[5, 10, 15, 20]}
              sx={{ 
                '& .MuiTablePagination-toolbar': {
                  backgroundColor: "#03112a",
                  color: '#eeca06',
                  display: 'flex',
                  justifyContent: 'center', // Centra el contenido dentro de la toolbar
                },
                '& .MuiTablePagination-selectLabel': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-input': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-selectIcon': {
                  color: '#eeca06',
                },
                '& .MuiTablePagination-displayedRows': {
                  color: '#eeca06',
                  margin: '0 1%', // Ajusta el margen para centrar
                },
                '& .MuiTablePagination-actions': {
                  color: '#eeca06',
                }
              }}
            />
          </Grid>
      </div>
    </div>
  )
}
