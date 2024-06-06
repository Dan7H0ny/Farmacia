import React, { useState, useEffect} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Visibility, FormatQuote } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const ListarProducto = () => {
  const [producto, setProducto] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [fecha_actualizacion_, setFechaActualizacion] = useState('');

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
  const categorias = [
    { nombre: 'Tabletas' },
    { nombre: 'Jarabe' },
    { nombre: 'Sueros' },
    { nombre: 'Dentifricos' },
    { nombre: 'Supositorios' },
    { nombre: 'Suplementos' },
  ];
  useEffect(() => {
    // Obtener la fecha actual en la zona horaria local
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setFechaActualizacion(formattedDate);
}, []);

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
        setProducto(response);
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
    axios.get('http://localhost:4000/usuario/mostrar', config)
      .then(response => {
        setUsuarios(response);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los usuario',
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
    const productoActual = producto[miIndex];
    axios.get(`http://localhost:4000/producto/buscar/${productoActual._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { _id, nombre, descripcion, categoria, proveedor, capacidad_caja, capacidad_unitaria, precio_por_menor, precio_por_mayor, 
      usuario, fecha_caducidad, fecha_registro, fecha_actualizacion } = response;
    const descripcion_ = descripcion.trim() === "" ? "S/n" : descripcion;
    const fechaCaducidadFormatted = fecha_caducidad ? new Date(fecha_caducidad).toISOString().split('T')[0] : '';
    const fechaRegistroFormatted = fecha_registro ? new Date(fecha_registro).toISOString().split('T')[0] : '';
    const fechaActualizacionFormatted = fecha_actualizacion ? new Date(fecha_actualizacion).toISOString().split('T')[0] : '';
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
          label {
            margin-bottom: 5px; /* Espacio entre el label y el input */
          }
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
          <td><strong>Tipo de categoria del producto:</strong></td>
          <td>${categoria}</td>
        </tr>
        <tr>
          <td><strong>Nombre del proveedor/marca del producto</strong></td>
          <td>${proveedor.nombre_marca}</td>
        </tr>
        <tr>
          <td><strong>Fecha de actualizacion de la venta:</strong></td>
          <td>${fechaActualizacionFormatted}</td>
        </tr>
        <tr>
          <td><strong>Capacidad Cajas/Unidades del producto</strong></td>
          <td>${capacidad_caja}, ${capacidad_unitaria} </td>
        </tr>
        <tr>
          <td><strong>Precio del producto:</strong></td>
          <td>${precio_por_menor} </td>
        </tr>
        <tr>
          <td><strong>Precio del producto:</strong></td>
          <td>${precio_por_menor} </td>
        </tr>
        <tr>
          <td><strong>Precio por mayor del producto:</strong></td>
          <td>${precio_por_mayor} </td>
        </tr>
        <tr>
          <td><strong>Datos del usuario:</strong></td>
          <td>${usuario.nombre}, ${usuario.correo}, ${usuario.rol}</td>
        </tr>
          <tr>
          <td><strong>Fecha de caducidad del producto:</strong></td>
          <td>${fechaCaducidadFormatted} </td>
        </tr>
        <tr>
          <td><strong>Fecha de registro del producto:</strong></td>
          <td>${fechaRegistroFormatted} </td>
        </tr>
        <tr>
          <td><strong>Fecha de actualizacion del producto:</strong></td>
          <td>${fechaActualizacionFormatted} </td>
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

        axios.delete(`http://localhost:4000/producto/eliminar/${_id}`, configInicial)
          .then((response) => {
            const productoActualizada = producto.filter((e, index) => index !== miIndex);
            setProducto(productoActualizada);
            Swal.fire({
              icon: 'success',
              title: 'producto eliminado',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el producto',
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
      const productoActual = producto[miIndex];
      axios.get(`http://localhost:4000/producto/buscar/${productoActual._id}`, configInicial)
        .then(response => {
          const { _id, nombre, descripcion, categoria, proveedor, capacidad_caja, capacidad_unitaria, precio_por_menor, 
            precio_por_mayor, usuario, fecha_caducidad, fecha_registro } = response; // Use response.data to get the actual data
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
                <select id="categoria-select" class="swal2-select" required>
                  ${categorias.map(c => `
                    <option value="${c._id}" ${c.nombre === categoria ? 'selected' : ''}>${c.nombre}</option>
                  `).join('')}
                </select>
              </div>
              <div class="swal-form-group">
                <label for="categoria-select">Nombre del proveedor/marca del producto:</label>
                <select id="proveedor-select" class="swal2-select" required>
                  ${proveedores.map(p => `
                    <option value="${p._id}" ${p._id === proveedor._id ? 'selected' : ''}>${p.nombre_marca}</option>
                  `).join('')}
                </select>
              </div>            
              <div class="swal-form-group">
                <label for="nombre-input">Capacidad Cajas del producto:</label>
                <input type="number" id="capacidad_primaria-input" value="${capacidad_caja}" class="swal2-input" required>
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">Capacidad Unidades del producto:</label>
                <input type="number" id="capacidad_secundaria-input" value="${capacidad_unitaria}" class="swal2-input" >
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">Precio al menor del producto:</label>
                <input type="number" id="precio_por_menor-input" value="${precio_por_menor}" class="swal2-input" required>
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">Precio al mayor del producto:</label>
                <input type="number" id="precio_por_mayor-input" value="${precio_por_mayor}" class="swal2-input" required>
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">Rol del usuario:</label>
                <input type="text" id="rol-input" value="${usuario.rol}" class="swal2-input" required>
              </div>
              <div class="swal-form-group">
                <label for="nombre-input">Correo del usuario:</label>
                <input type="text" id="correo-input" value="${usuario.correo}" class="swal2-input" required>
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
              const categoria_ = Swal.getPopup().querySelector('#categoria-select').value;
              const proveedor_ = Swal.getPopup().querySelector('#proveedor-select').value;
              const capacidad_primaria_ = Swal.getPopup().querySelector('#capacidad_primaria-input').value;
              const capacidad_secundaria_ = Swal.getPopup().querySelector('#capacidad_secundaria-input').value;
              const menor_ = Swal.getPopup().querySelector('#precio_por_menor-input').value;
              const mayor_ = Swal.getPopup().querySelector('#precio_por_mayor-input').value;
              const fecha_ = Swal.getPopup().querySelector('#fecha-input').value;
              return { nombre_, descripcion_, categoria_, proveedor_, capacidad_primaria_, capacidad_secundaria_, menor_, mayor_, fecha_ };
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
              const { nombre_, descripcion_, categoria_, proveedor_, capacidad_primaria_, capacidad_secundaria_, menor_, mayor_, fecha_ } = result.value;
              axios.put(`http://localhost:4000/producto/actualizar/${_id}`, {
                nombre: nombre_,
                descripcion: descripcion_,
                categoria: categoria_,
                proveedor: proveedor_,
                capacidad_caja: capacidad_primaria_,
                capacidad_unitaria: capacidad_secundaria_,
                precio_por_menor: menor_,
                precio_por_mayor: mayor_,
                usuario: usuario,
                fecha_caducidad: fecha_,
                fecha_registro: fecha_registro,
                fecha_actualizacion: fecha_actualizacion_,
              }, configInicial)
                .then((response) => {
                  const nombreUsuario = usuarios.find(u => u._id === usuario._id).nombre;
                  const nombre_marca_Nombre = proveedores.find(p => p._id === proveedor._id).nombre_marca;
                  const productoActualizadas = producto.map((producto, index) => {
                    if (index === miIndex) {
                      return {
                        ...producto,
                        nombre: nombre_,
                        descripcion: descripcion_,
                        categoria: categoria_,
                        proveedor:  { ...producto.proveedor, nombre_marca: nombre_marca_Nombre },
                        capacidad_caja: capacidad_primaria_,
                        capacidad_unitaria: capacidad_secundaria_,
                        precio_por_menor: menor_,
                        precio_por_mayor: mayor_,
                        usuario: { ...producto.usuario, nombre: nombreUsuario },
                        fecha_caducidad: fecha_,
                        fecha_registro: fecha_registro,
                        fecha_actualizacion: fecha_actualizacion_,
                      };
                    } else {
                      return producto;
                    }
                  });
                  setProducto(productoActualizadas);
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
                    text: error.message,
                  });
                });
            }
          });
        })
        .catch(error => {
          console.log(error.message);
        });
    }
  };
 
  return (
    <div id="productolistar" style={{ textAlign: 'left', marginRight: '10px',marginLeft:'10px' }}>
      <Typography variant="h6" style={{ marginTop: 0 , textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a", paddingLeft: '280px', paddingRight: '280px' }}>
        Listado de registro de productos
      </Typography>

      <div className="table-responsive">
        {
          <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Actualizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              {producto.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{x.nombre}</TableCell>
                  <TableCell>{x.categoria}</TableCell>
                  <TableCell>{x.proveedor.nombre_marca}</TableCell>
                  <TableCell>{x.precio_por_menor}</TableCell>
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
