import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid,TablePagination, InputAdornment, TextField } from '@mui/material';
import { Visibility, ModeEdit, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


export const ListarProveedor = () => {
  const [proveedores, setproveedores] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    axios.get('http://localhost:4000/proveedor/mostrar', config)
      .then(response => {
        setproveedores(response);
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate]);

  const botonActualizar = (proveedor) => {
    const token = obtenerToken();
    if (!token) {
      // Redirigir al login si el token no existe
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador');
    }
    else{
      axios.get(`http://localhost:4000/proveedor/buscar/${proveedor._id}`, configInicial)
      .then(response => {
        // Acciones a realizar con los datos del usuario encontrado
        const { _id, nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular } = response;
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
                <td><strong>Nombre del proveedor:</strong></td>
                <td contenteditable="true" id="nombre">${nombre_marca}</td>
            </tr>
            <tr>
                <td><strong>Correo del proveedor:</strong></td>
                <td contenteditable="true" id="correo">${correo}</td>
            </tr>
            <tr>
                <td><strong>Telefono del proveedor:</strong></td>
                <td contenteditable="true" id="telefono">${telefono}</td>
            </tr>
            <tr>
                <td><strong>Sitio Web del proveedor:</strong></td>
                <td contenteditable="true" id="sitioweb">${sitioweb}</td>
            </tr>
            <tr>
                <td><strong>Nombre del vendedor del proveedor:</strong></td>
                <td contenteditable="true" id="nombre_vendedor">${nombre_vendedor}</td>
            </tr>
            <tr>
                <td><strong>Correo del vendedor del proveedor:</strong></td>
                <td contenteditable="true" id="correo_vendedor">${correo_vendedor}</td>
            </tr>
            <tr>
                <td><strong>Celular del vendedor del proveedor:</strong></td>
                <td contenteditable="true" id="celular">${celular}</td>
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
              const correo_ = document.getElementById('correo').textContent;
              const telefono_ = parseInt(document.getElementById('telefono').textContent);
              const sitioweb_ = document.getElementById('sitioweb').textContent;
              const nombre_vendedor_ = document.getElementById('nombre_vendedor').textContent;
              const correo_vendedor_ = document.getElementById('correo_vendedor').textContent;
              const celular_ = parseInt(document.getElementById('celular').textContent);
              return { nombre_, correo_, telefono_, sitioweb_, nombre_vendedor_, correo_vendedor_, celular_ };
            },
            customClass: {
                container: 'my-swal-container', // Clase personalizada para el contenedor principal
            },
            didOpen: () => {
              const telefonoInput = document.getElementById('telefono');
              const celularInput = document.getElementById('celular');

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
                celularInput.addEventListener('input', function () {
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
                container.style.width = '45%'; // Personalizar el ancho del contenedor
                container.style.padding = '20px'; // Personalizar el padding del contenedor
                container.style.marginRight = '0%'; // Márgen derecho de 100px
                container.style.marginLeft = '0px'; // Márgen izquierdo de 265px
            },
      }).then((result) => {
        console.log(result)
        if (result.isConfirmed) {
          const {  nombre_, correo_, telefono_, sitioweb_, nombre_vendedor_, correo_vendedor_, celular_  } = result.value;
          console.log(celular_)
          axios.put(`http://localhost:4000/proveedor/actualizar/${_id}`, {
              nombre_marca: nombre_,
              correo: correo_,
              telefono: telefono_,
              sitioweb: sitioweb_,            
              nombre_vendedor: nombre_vendedor_,
              correo_vendedor: correo_vendedor_,
              celular: celular_,
            }, configInicial)
            .then((response) => {
              const proveedorActualizado = proveedores.map((proveedor) => {
                if (proveedor._id === _id) {
                  return {
                    ...proveedor,
                    nombre_marca: nombre_,
                    correo: correo_,
                    telefono: telefono_,
                    sitioweb: sitioweb_,            
                    nombre_vendedor: nombre_vendedor_,
                    correo_vendedor: correo_vendedor_,
                    celular: celular_,
                  };
                } else {
                  return proveedor;
                }
              });
              setproveedores(proveedorActualizado);
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
      });
      })
      .catch(error => {
        console.log(error.mensaje);
      });
    }
    };

    const botonMostrar = (proveedor) => {
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
      axios.get(`http://localhost:4000/proveedor/buscar/${proveedor._id}`, configInicial)
      .then(response => {
        // Acciones a realizar con los datos del usuario encontrado
      const { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular, fecha_registro, fecha_actualizacion } = response;
      const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
      const fechaActualizacion = fecha_actualizacion ? formatDateTime(new Date(fecha_actualizacion)) : '';
  
      function formatDateTime(date) {
        const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
        const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
        return `${formattedDate} ${formattedTime}`;
        }
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
            <td><strong>Nombre del proveedor:</strong></td>
            <td>${nombre_marca}</td>
          </tr>
          <tr>
            <td><strong>Correo del proveedor:</strong></td>
            <td>${correo}</td>
          </tr>
          <tr>
            <td><strong>Telefono del proveedor:</strong></td>
            <td>${telefono}</td>
          </tr>
          <tr>
            <td><strong>Sitio Web del proveedor:</strong></td>
            <td>${sitioweb}</td>
          </tr>
          <tr>
            <td><strong>Nombre del vendedor:</strong></td>
            <td>${nombre_vendedor}</td>
          </tr>
          <tr>
            <td><strong>Correo del vendedor:</strong></td>
            <td>${correo_vendedor}</td>
          </tr>
          <tr>
            <td><strong>Celular del vendedor:</strong></td>
            <td>${celular}</td>
          </tr>
           <tr>
            <td><strong>Fecha de registro del proveedor:</strong></td>
            <td>${fechaRegistro}</td>
          </tr>
           <tr>
            <td><strong>Fecha de actualizacion del proveedor:</strong></td>
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

  const filtrarProveedor = proveedores.filter((proveedor) => 
    proveedor.nombre_marca && proveedor.nombre_marca.toLowerCase().includes(buscar.toLowerCase())
  );

  const pagitedProveedor = filtrarProveedor.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  return (
    <div id="Sucursal" style={{ textAlign: 'left',marginRight: '10px',marginLeft:'10px'}}> 
      <Typography variant="h6" component="div" style={{ marginTop: 0, textAlign: 'center',fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a",  paddingLeft: '235px', paddingRight: '235px'   }}>
        LISTA DE PROVEEDORES
      </Typography>
      <Grid item xs={12} sm={4} sx={{marginTop: 2, '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
      <TextField
        label="Nombre del proveedor"
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
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center'  } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre de la Marca</TableCell>
                <TableCell>Nombre del Vendedor</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              {pagitedProveedor.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                  <TableCell>{x.nombre_marca}</TableCell>
                  <TableCell>{x.nombre_vendedor}</TableCell>
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
            count={filtrarProveedor.length}
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
