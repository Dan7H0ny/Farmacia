import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid,TablePagination,InputAdornment, TextField  } from '@mui/material';
import { Visibility, ModeEdit, Search, Boy, Girl } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../assets/css/listarUsuario.css';

const renderIcon = (sexo) => {
  return sexo === 'Masculino' ? <Boy/> : <Girl/>;
};

export const ListarCliente = () => {

  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const generos = [
    { nombre: 'Masculino' },
    { nombre: 'Femenino' },
  ];

  const navigate = useNavigate();
  const obtenerToken = () => {
    // Obtener el token del local storage
    const token = localStorage.getItem('token');
    return token;
  }; 
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
    axios.get('http://localhost:4000/cliente/mostrar', config )
      .then(response => {
        setClientes(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los clientes',
          text: error.response ? error.response.data.mensaje : 'Error desconocido',
        });
      });
  }, [navigate]);

  const botonActualizar = (cliente) => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
    // Redirigir al login si el token no existe
      Swal.fire({icon: 'error',title: 'El token es invalido',text: "error",});
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`http://localhost:4000/cliente/buscar/${cliente._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
      const { _id, nombre, apellido, correo, telefono, sexo, nit_ci_cex } = response;
      const selectOptions = generos.map(s => `
        <option value="${s.nombre}" ${s.nombre === sexo ? 'selected' : ''}>${s.nombre}</option>
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
              <td><strong>Nombre del cliente:</strong></td>
              <td contenteditable="true" id="nombre">${nombre}</td>
          </tr>
          <tr>
              <td><strong>Apellido del cliente:</strong></td>
              <td contenteditable="true" id="apellido">${apellido}</td>
          </tr>
          <tr>
              <td><strong>Correo del cliente:</strong></td>
              <td contenteditable="true" id="correo">${correo}</td>
          </tr>
          <tr>
              <td><strong>Teléfono del cliente:</strong></td>
              <td contenteditable="true" id="telefono">${telefono}</td>
          </tr>
          <tr>
              <td><strong>NIT/CI/CEX del cliente:</strong></td>
              <td contenteditable="true" id="nit_ci_cex">${nit_ci_cex}</td>
          </tr>
          <tr>
            <td><strong>Genero del cliente:</strong></td>
              <td>
                <select id="sexo">
                  ${selectOptions}
                </select>
              </td>
          </tr>
      `;
      Swal.fire({
          title: 'ACTUALIZAR AL CLIENTE',
          html: table,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const nombre_ = document.getElementById('nombre').textContent;
            const apellido_ = document.getElementById('apellido').textContent;
            const correo_ = document.getElementById('correo').textContent;
            const telefono_ = parseInt(document.getElementById('telefono').textContent);
            const nit_ci_cex_ = parseInt(document.getElementById('nit_ci_cex').textContent);
            const sexo_ = document.getElementById('sexo').value;
            return { nombre_, apellido_, correo_, telefono_, nit_ci_cex_, sexo_ };
          },
          customClass: {
              container: 'my-swal-container', // Clase personalizada para el contenedor principal
          },
          didOpen: () => {
            const nombreInput = document.getElementById('nombre');
            const apellidoInput = document.getElementById('apellido');
            const telefonoInput = document.getElementById('telefono');
            const nit_ci_cexInput = document.getElementById('nit_ci_cex');
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
            nit_ci_cexInput.addEventListener('input', function () {
              if (typeof this.textContent !== 'undefined') {
              // Eliminar cualquier carácter que no sea un dígito
                this.textContent = this.textContent.replace(/[^\d]/g, '');
                // Verificar si el número tiene más de 8 dígitos
                  if (this.textContent.length > 12) {
                  // Si tiene más de 8 dígitos, truncar el valor a 8 dígitos
                    this.textContent = this.textContent.slice(0, 12);
                  }
                }
              });        
              // Agregar estilos personalizados al contenedor principal
              const container = Swal.getPopup();
              container.style.width = '35%'; // Personalizar el ancho del contenedor
              container.style.padding = '20px'; // Personalizar el padding del contenedor
              container.style.marginRight = '0%'; // Márgen derecho de 100px
              container.style.marginLeft = '0px'; // Márgen izquierdo de 265px
          },
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        const { nombre_, apellido_, correo_, telefono_, nit_ci_cex_, sexo_  } = result.value;
        if (telefono_.toString().length >= 2) {
          // Verificar el rango del número de teléfono
          if (telefono_ >= 60000000 && telefono_ <= 79999999) {
        axios.put(`http://localhost:4000/cliente/actualizar/${_id}`, {
            nombre: nombre_,
            apellido: apellido_,
            correo: correo_,
            telefono: telefono_,            
            sexo: sexo_,
            nit_ci_cex: nit_ci_cex_,
          }, configInicial)
          .then((response) => {
            const clienteActualizado = clientes.map((cliente) => {
              if (cliente._id === _id) {
                return {
                  ...cliente,
                  nombre: nombre_,
                  apellido: apellido_,
                  correo: correo_,
                  telefono: telefono_,
                  sexo: sexo_,
                  nit_ci_cex: nit_ci_cex_,
                };
              } else {
                return cliente;
              }
            });
            setClientes(clienteActualizado);
            Swal.fire({
              icon: 'success',
              title: 'Cliente actualizado',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar el Cliente',
              text: error.mensaje,
            });
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el Cliente',
            text: 'El número de teléfono debe estar entre 60000000 y 79999999',
          });
        }
      }else{
          axios.put(`http://localhost:4000/cliente/actualizar/${_id}`, {
            nombre: nombre_,
            apellido: apellido_,
            correo: correo_,
            telefono: telefono_,
            nit_ci_cex: nit_ci_cex_,
            sexo: sexo_,
        }, configInicial)
        .then((response) => {
            const clienteActualizado = clientes.map((cliente) => {
                if (cliente._id === _id) {
                    return {
                        ...cliente,
                        nombre: nombre_,
                        apellido: apellido_,
                        correo: correo_,
                        telefono: telefono_,
                        nit_ci_cex: nit_ci_cex_,
                        sexo: sexo_,
                    };
                } else {
                    return cliente;
                }
            });
            setClientes(clienteActualizado);
            Swal.fire({
                icon: 'success',
                title: 'Cliente actualizado',
                text: response.mensaje,
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar el Cliente',
                text: error.mensaje,
            });
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
    const token = obtenerToken();
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "Error al obtener el token de acceso",
      });
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`http://localhost:4000/cliente/buscar/${cliente._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { nombre, apellido, correo, telefono, sexo, nit_ci_cex, fecha_registro, fecha_actualizacion } = response;
    const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
    const fechaActualizacion = fecha_actualizacion ? formatDateTime(new Date(fecha_actualizacion)) : '';

    function formatDateTime(date) {
      const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
      const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
      return `${formattedDate} ${formattedTime}`;
      }
    const renderIcon = (sexo) => {
      return sexo === 'Masculino' ? '<i class="fas fa-male" style="color:blue"></i>' : '<i class="fas fa-female" style="color:blue"></i>';
    };
    Swal.fire({
      title: 'Mostrar los datos del Cliente',
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
          <td><strong>Nombre completo del cliente:</strong></td>
          <td>${nombre}</td>
        </tr>
        <tr>
          <td><strong>Apellido completo del cliente:</strong></td>
          <td>${apellido}</td>
        </tr>
        <tr>
          <td><strong>Correo del cliente:</strong></td>
          <td>${correo}</td>
        </tr>
        <tr>
          <td><strong>Teléfono del cliente:</strong></td>
          <td>${telefono}</td>
        </tr>
        <tr>
          <td><strong>Identificacion NIT/CI/CEX:</strong></td>
          <td>${nit_ci_cex}</td>
        </tr>
        <tr>
          <td><strong>Género del cliente:</strong></td>
          <td>${renderIcon(sexo)}</td>
        </tr>
         <tr>
          <td><strong>Fecha de registro del cliente:</strong></td>
          <td>${fechaRegistro}</td>
        </tr>
         <tr>
          <td><strong>Fecha de actualizacion del cliente:</strong></td>
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

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(buscar.toLowerCase())
  );  

  const paginatedClientes = filteredClientes.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  return (
    <div id="caja_contenido" style={{ textAlign: 'left',marginLeft:'-5%', marginRight: '-5%'}}>
      <Typography variant="h6" component="div" style={{ marginTop: 15, textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a", paddingLeft: '280px', paddingRight: '280px' }}>
        LISTA DE CLIENTES
      </Typography>
    <Grid item xs={12} sm={4} sx={{marginTop: 2, '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
      <TextField
        label="Nombre del cliente"
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
      <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
        <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Identificacion</TableCell>
            <TableCell>Genero</TableCell>
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
              <TableCell>{x.nit_ci_cex}</TableCell>
              <TableCell className="text-center">{renderIcon(x.sexo)}</TableCell>
              <TableCell className="text-center">
                <Button variant="contained" onClick={() => botonMostrar(x)}>
                  <Visibility />
                </Button>
              </TableCell>
              <TableCell className="text-center">
                <Button variant="contained" color="success" onClick={() => botonActualizar(x)}>
                  <ModeEdit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid item xs={12} sm={4} sx={{ marginTop: 2, '& .MuiTextField-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
        <TablePagination
          component="div"
          count={filteredClientes.length}
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
