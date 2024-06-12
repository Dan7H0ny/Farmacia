import React, { useState, useEffect} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid,TablePagination,InputAdornment, TextField, Switch  } from '@mui/material';
import { Visibility, Edit, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CustomSwitch = styled(Switch)`
  .MuiSwitch-switchBase.Mui-checked {
    color: #eeca06;
  }
  .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    background-color: #eeca06;
  }
`;

export const ListarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);

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
        text: "error",
      });
      navigate('/Menu/Administrador');
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.get('http://localhost:4000/producto/mostrar', config)
      .then(response => {
        setProductos(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los productos',
          text: error.response ? error.response.data.mensaje : 'Error desconocido',
        });
        navigate('/Menu/Administrador')
      });
  }, [navigate]);

  useEffect(() => {
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
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.get('http://localhost:4000/tipo/mostrar', config)
      .then(response => {
        setTipos(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los usuario',
          text: error.response ? error.response.mensaje : 'Error desconocido',
        });
        navigate('/Menu/Administrador')
      });
  }, [navigate]);

  useEffect(() => {
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
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.get('http://localhost:4000/categoria/mostrar', config)
      .then(response => {
        setCategorias(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los usuario',
          text: error.response ? error.response.mensaje : 'Error desconocido',
        });
        navigate('/Menu/Administrador')
      });
  }, [navigate]);

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
        setProveedores(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los proveedores',
          text: error.response ? error.response.data.mensaje : 'Error desconocido',
        });
        navigate('/Menu/Administrador')
      });
      
  }, [navigate]);
 
  const botonMostrar = (producto) => {
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
    axios.get(`http://localhost:4000/producto/buscar/${producto._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { nombre, descripcion, categoria, tipo, proveedor, cantidad, capacidad, capacidad_pres, precio, usuario, 
      fecha_caducidad, fecha_registro, fecha_actualizacion } = response;
    const fechaCaducidad = fecha_caducidad ? formatDateTime(new Date(fecha_caducidad)) : '';
    const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
    const fechaActualizacion = fecha_actualizacion ? formatDateTime(new Date(fecha_actualizacion)) : '';
    function formatDateTime(date) {
      const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
      const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
      return `${formattedDate} ${formattedTime}`;
  }
    const descripcion_ = descripcion.trim() === "" ? "S/n" : descripcion;
    Swal.fire({
      title: 'Mostrar producto',
      html: `
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
        <table>
        <tr>
          <td><strong>Nombre del producto:</strong></td>
          <td>${nombre}</td>
        </tr>
        <tr>
        <td><strong>Descripcion del producto:</strong></td>
        <td>${descripcion_}</td>
        </tr>
        <tr>
          <td><strong>Categoria del producto:</strong></td>
          <td>${categoria.nombre}</td>
        </tr>
        <tr>
          <td><strong>Tipo de presentacion del producto:</strong></td>
          <td>${tipo.nombreTipo}</td>
        </tr>
        <tr>
          <td><strong>Nombre del proveedor/marca del producto</strong></td>
          <td>${proveedor.nombre_marca}</td>
        </tr>
        <tr>
          <td><strong>Cantidad de presentacion del producto</strong></td>
          <td>${cantidad} </td>
        </tr>
        <tr>
          <td><strong>Capacidad de precentacion del producto:</strong></td>
          <td>${capacidad_pres} </td>
        </tr>
        <tr>
          <td><strong>Capacidad del Stock del producto:</strong></td>
          <td>${capacidad} </td>
        </tr>
        <tr>
          <td><strong>Precio del producto:</strong></td>
          <td>${precio} </td>
        </tr>
        <tr>
          <td><strong>Datos del usuario:</strong></td>
          <td>${usuario.nombre}, ${usuario.correo}, ${usuario.rol}</td>
        </tr>
        <tr>
          <td><strong>Fecha de caducidad del producto:</strong></td>
          <td>${fechaCaducidad} </td>
        </tr>
        <tr>
          <td><strong>Fecha de registro del producto:</strong></td>
          <td>${fechaRegistro} </td>
        </tr>
        <tr>
          <td><strong>Fecha de actualizacion del producto:</strong></td>
          <td>${fechaActualizacion} </td>
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
        console.log(error.mensaje);
      });
    }
  };  
  
  const botonActualizar = (producto) => {
    const token = obtenerToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`http://localhost:4000/producto/buscar/${producto._id}`, configInicial)
        .then(response => {
          const { _id, nombre, descripcion, categoria, tipo, proveedor, cantidad, capacidad, capacidad_pres, precio, fecha_caducidad } = response; // Use response.data to get the actual data
          const fechaCaducidadFormatted = fecha_caducidad ? new Date(fecha_caducidad).toISOString().split('T')[0] : '';
          Swal.fire({
            title: 'Actualizar producto',
            html: `
              <style>
                .swal-form-group {
                  display: flex;
                  flex-direction: column;
                  margin-bottom: 0px;
                }
                label {
                  margin-bottom: 0px;
                }
              </style>
              <div class="swal-form-group">
                <label for="nombre-input">Nombre del producto:</label>
                <input type="text" id="nombre-input" value="${nombre}" class="swal2-input" required>
              </div>
              <div class="swal-form-group">
                <label for="descripcion-input">Descripción del producto:</label>
                <input type="text" id="descripcion-input" value="${descripcion}" class="swal2-input" required>
              </div>
              <div class="swal-form-group">
                <label for="descripcion-input">Categoria del producto:</label>
                <select id="nombre-select" class="swal2-select" required>
                  ${categorias.map(c => `
                    <option value="${c._id}" ${c._id === categoria._id ? 'selected' : ''}>${c.nombre}</option>
                  `).join('')}
                </select>
              </div>
              <div class="swal-form-group">
                <label for="descripcion-input">Tipo del producto:</label>
                <select id="nombeTipo-select" class="swal2-select" required>
                  ${tipos.map(t => `
                    <option value="${t._id}" ${t._id === tipo._id ? 'selected' : ''}>${t.nombreTipo}</option>
                  `).join('')}
                </select>
              </div>
              <div class="swal-form-group">
                <label for="categoria-select">Nombre del proveedor/marca del producto:</label>
                <select id="nombre_marca-select" class="swal2-select" required>
                  ${proveedores.map(p => `
                    <option value="${p._id}" ${p._id === proveedor._id ? 'selected' : ''}>${p.nombre_marca}</option>
                  `).join('')}
                </select>
              </div>            
              <div class="swal-form-group">
                <label for="nombre-input">Cantidad de presentacion del producto:</label>
                <input type="number" id="cantidad-input" value="${cantidad}" class="swal2-input" required>
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">Capacidad de presentacion del producto:</label>
                <input type="number" id="capacidad_pres-input" value="${capacidad_pres}" class="swal2-input" >
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">cantidad de Stock del producto en unidades:</label>
                <input type="number" id="capacidad-input" value="${capacidad}" class="swal2-input" >
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">Precio al menor del producto:</label>
                <input type="number" id="precio-input" value="${precio}" class="swal2-input" required>
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">Fecha de caducidad:</label>
                <input type="date" id="fecha-input" value="${fechaCaducidadFormatted}" class="swal2-input" required>
              </div>
            `,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            textAlign: 'left',
            preConfirm: () => {
              const nombre_ = Swal.getPopup().querySelector('#nombre-input').value;
              const descripcion_ = Swal.getPopup().querySelector('#descripcion-input').value;
              const categoria_ = Swal.getPopup().querySelector('#nombre-select').value;
              const tipo_ = Swal.getPopup().querySelector('#nombeTipo-select').value;
              const proveedor_ = Swal.getPopup().querySelector('#nombre_marca-select').value;
              const cantidad_ = Swal.getPopup().querySelector('#cantidad-input').value;
              const capacidad_pres_ = Swal.getPopup().querySelector('#capacidad_pres-input').value;
              const capacidad_ = Swal.getPopup().querySelector('#capacidad-input').value;
              const precio_ = Swal.getPopup().querySelector('#precio-input').value;
              const fecha_ = Swal.getPopup().querySelector('#fecha-input').value;
              return { nombre_, descripcion_, categoria_, tipo_, proveedor_, cantidad_, capacidad_pres_, capacidad_, precio_, fecha_ };
            },
            customClass: {
              container: 'my-swal-container',
            },
            didOpen: () => {
              const container = Swal.getPopup();
              container.style.width = '50%';
              container.style.padding = '20px';
              container.style.marginRight = '100px';
              container.style.marginLeft = '330px';
            },
          }).then((result) => {
            if (result.isConfirmed) {
              const { nombre_, descripcion_, categoria_, tipo_, proveedor_, cantidad_, capacidad_pres_, capacidad_, precio_, fecha_} = result.value;
              axios.put(`http://localhost:4000/producto/actualizar/${_id}`, {
                nombre: nombre_,
                descripcion: descripcion_,
                categoria: categoria_,
                tipo: tipo_,
                proveedor: proveedor_,
                cantidad: cantidad_,
                capacidad_pres: capacidad_pres_,
                capacidad: capacidad_,
                precio: precio_,
                fecha_caducidad: fecha_,
              }, configInicial)
              .then((response) => {
                setProductos(response.productosEncontrados );
                  Swal.fire({
                    icon: 'success',
                    title: 'Producto actualizado',
                    text: response.mensaje,
                  });
                })
                .catch((error) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el producto',
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

  const handleSwitchChange = async (event, id, estado) => {
    const nuevoEstado = event.target.checked ? true : false;
    try {
      await axios.put(`http://localhost:4000/producto/eliminar/${id}`, { estado: nuevoEstado }, configInicial);
      setProductos((prevProducto) =>
        prevProducto.map((producto) =>
          producto._id === id ? { ...producto, estado: nuevoEstado } : producto
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

  const filtrarProducto = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(buscar.toLowerCase())
  );  

  const paginProducto = filtrarProducto.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
 
  return (
    <div id="caja_contenido" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px' }}>
      <Typography variant="h6" style={{ marginTop: 0 , textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a", paddingLeft: '280px', paddingRight: '280px' }}>
        Listado de registro de productos
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
          <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a",textAlign: 'center' } }}>
              {paginProducto.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                  <TableCell>{x.nombre}</TableCell>
                  <TableCell>{x.categoria.nombre}</TableCell>
                  <TableCell>{x.proveedor.nombre_marca}</TableCell>
                  <TableCell>{x.precio}</TableCell>
                  <TableCell className="text-center">
                    <CustomSwitch
                      checked={x.estado === true}
                      onChange={(event) => handleSwitchChange(event, x._id, x.estado)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" onClick={() => botonMostrar(x)}>
                      <Visibility />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" color="success" onClick={() => botonActualizar(x)}>
                      <Edit />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Grid item xs={12} sm={4} sx={{ marginTop: 2, '& .MuiTextField-root': { color: '#eeca06', backgroundColor: "#03112a" } }}>
            <TablePagination
              component="div"
              count={filtrarProducto.length}
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
