import React, { useState, useEffect} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Visibility, FormatQuote } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const ListarVenta = () => {
  const [ventas, setVentas] = useState([]);
  const rol = localStorage.getItem('rol');
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
    const { _id, cliente, productos, precio_total, fecha_emision, fecha_actualizacion, usuario_registra, usuario_update } = response;
    const fechaRegistroFormatted = fecha_emision ? new Date(fecha_emision).toISOString().split('T')[0] : '';
    const fechaActualizacionFormatted = fecha_actualizacion ? new Date(fecha_actualizacion).toISOString().split('T')[0] : '';
    let productosHTML = '';
    productos.forEach((productoItem, prodIndex) => {
      productosHTML += `
        <div key=${prodIndex}>
          Nombre: ${productoItem.producto.nombre}, 
          Cantidad: ${productoItem.cantidad}, 
          Precio: ${productoItem.precio}
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
        console.log(rol)
        axios.delete(`http://localhost:4000/venta/eliminar/${_id}`, {
          data: { rol }, // Enviamos el rol en el cuerpo de la solicitud
          ...configInicial // Mantener la configuración inicial
        })
          .then((response) => {
            const VentaEliminada = ventas.filter((e, index) => index !== miIndex);
            setVentas(VentaEliminada);
            Swal.fire({
              icon: 'success',
              title: 'venta eliminada',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar la venta',
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
 
  return (
    <div id="productolistar" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px' }}>
      <Typography variant="h6" style={{ marginTop: 0, textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a", paddingLeft: '280px', paddingRight: '280px' }}>
        Listado de registro de las ventas
      </Typography>

      <div className="table-responsive">
        {
          <Table className="table table-bordered table-hover" style={{ marginTop: 25 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Precio total</TableCell>
                <TableCell>Fecha Emision</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Actualizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              {ventas.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{x.cliente.nombre}, {x.cliente.apellido}, {x.cliente.nit_ci_cex} </TableCell>
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
                        {productoItem.cantidad}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        {productoItem.precio}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{x.precio_total}</TableCell>
                  <TableCell>{new Date(x.fecha_emision).toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" onClick={() => botonMostrar(index)}>
                      <Visibility />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" color="success" onClick={() => botonActualizar(index)}>
                      <FormatQuote />
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
