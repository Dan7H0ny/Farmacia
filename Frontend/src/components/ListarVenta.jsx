import React, { useState, useEffect} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid,TablePagination,InputAdornment, TextField } from '@mui/material';
import { Visibility, ModeEdit, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const ListarVenta = () => {
  const [ventas, setVentas] = useState([]);
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
    axios.get('http://localhost:4000/venta/mostrar', config)
      .then(response => {
        setVentas(response);
        console.log(response)
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener las ventas',
          text: error.response ? error.response.data.mensaje : 'Error desconocido',
        });
        navigate('/Menu/Administrador')
      });
  }, [navigate]);

  

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
    const ventaActual = ventas[miIndex];
    axios.get(`http://localhost:4000/venta/buscar/${ventaActual._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { cliente, productos, precio_total, fecha_registro, fecha_actualizacion, usuario_registra, usuario_update } = response;
    const fechaRegistroFormatted = fecha_registro ? new Date(fecha_registro).toISOString().split('T')[0] : '';
    const fechaActualizacionFormatted = fecha_actualizacion ? new Date(fecha_actualizacion).toISOString().split('T')[0] : '';
    let productosHTML = '';
    productos.forEach((productoItem, prodIndex) => {
      productosHTML += `
        <div key=${prodIndex}>
          Nombre: ${productoItem.producto.nombre}, 
          Cantidad: ${productoItem.cantidad_producto}, 
          Precio: ${productoItem.precio_producto}
        </div>`;
    });

    Swal.fire({
      title: 'Mostrar venta',
      html: `
        <style>
          .swal-form-group {
            display: flex;
            flex-direction: wrap;
            margin-bottom: 0px;
            justify-content: space-between;
          }
          label {
            margin-bottom: 5px; /* Espacio entre el label y el input */
          }
          td, th {
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
        <table>
          <tr>
            <td><strong>Datos del cliente:</strong></td>
            <td>${cliente.nombre}, ${cliente.apellido}, ${cliente.nit_ci_cex}</td>
          </tr>
          <tr>
          <td><strong>Productos comprados:</strong></td>
          <td>${productosHTML}</td>
          </tr>
          <tr>
            <td><strong>Precio Total:</strong></td>
            <td>${precio_total}</td>
          </tr>
          <tr>
            <td><strong>Fecha de registro de la venta:</strong></td>
            <td>${fechaRegistroFormatted}</td>
          </tr>
          <tr>
            <td><strong>Fecha de actualizacion de la venta:</strong></td>
            <td>${fechaActualizacionFormatted}</td>
          </tr>
          <tr>
            <td><strong>Usuario que registro la venta:</strong></td>
            <td>${usuario_registra.nombre}, ${usuario_registra.apellido}, ${usuario_registra.rol} </td>
          </tr>
          <tr>
          <td><strong>Usuario que actualizo la venta:</strong></td>
          <td>${usuario_update.nombre}, ${usuario_update.apellido}, ${usuario_update.rol} </td>
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

  const botonActualizar = (miIndex) => {
    const token = obtenerToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'El token es invalido',
        text: "error",
      });
      navigate('/Menu/Administrador');
    } else {
      const ventaActual = ventas[miIndex];
      axios.get(`http://localhost:4000/venta/buscar/${ventaActual._id}`, configInicial)
        .then(response => {
          const { _id, cliente, productos, precio_total} = response;
          const ventaData = { _id, cliente, productos, precio_total };
          navigate('/Menu/Administrador/Venta/Registrar', { state: { ventaData } });
        })
        .catch(error => {
          console.log(error.mensaje);
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

  const filtrarProducto = ventas.filter(venta =>
    venta.productos.some(productoItem =>
      productoItem.producto.nombre.toLowerCase().includes(buscar.toLowerCase())
    )
  );
  
  const paginaProducto = filtrarProducto.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
 
  return (
    <div id="productolistar" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px' }}>
      <Typography variant="h6" style={{ marginTop: 0, textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a", paddingLeft: '280px', paddingRight: '280px' }}>
        Listado de las ventas
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
        {
          <Table className="table table-bordered table-hover" style={{ marginTop: 25 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Precio total</TableCell>
                <TableCell>Fecha Emision</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
              {paginaProducto.map((x, index) => ( // Aquí cambio ventas por filtrarProducto
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{x.cliente.nombre}, {x.cliente.apellido}, {x.cliente.nit_ci_cex}</TableCell>
                  <TableCell>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        {productoItem.producto.nombre}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        {productoItem.cantidad_producto}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        {productoItem.precio_producto}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{x.precio_total}</TableCell>
                  <TableCell>{new Date(x.fecha_registro).toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" onClick={() => botonMostrar(index)}>
                      <Visibility />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" color="success" onClick={() => botonActualizar(index)}>
                      <ModeEdit />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
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
