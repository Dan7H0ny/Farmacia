import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Visibility, FormatQuote } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


export const ListarProveedor = () => {
  const [proveedores, setproveedores] = useState([]);
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

  const botonActualizar = (miIndex) => {
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
    const TipoActual = proveedores[miIndex]; 
    axios.get(`http://localhost:4000/proveedor/buscar/${TipoActual._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { _id, nombre_marca, telefono, correo, sitioweb} = response;
    Swal.fire({
      title: 'Actualizar Proveedor',
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
        <label for="nombres-input">Nombre:</label>
        <input type="text" id="nombres-input" value="${nombre_marca}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="nombres-input">Correo:</label>
        <input type="text" id="correo-input" value="${correo}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="nombres-input">Telefono:</label>
        <input type="number" id="telefono-input" value="${telefono}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="nombres-input">Sitio Web:</label>
        <input type="text" id="sitioweb-input" value="${sitioweb}" class="swal2-input" required>
      </div>
    `,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre_marca_ = Swal.getPopup().querySelector('#nombres-input').value;
        const telefono_ = Swal.getPopup().querySelector('#telefono-input').value;
        const correo_ = Swal.getPopup().querySelector('#correo-input').value;
        const sitioweb_ = Swal.getPopup().querySelector('#sitioweb-input').value;
        return { nombre_marca_, telefono_, correo_, sitioweb_ };
      },
      customClass: {
        container: 'my-swal-container', // Clase personalizada para el contenedor principal
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
        const { nombre_marca_, telefono_, correo_, sitioweb_  } = result.value;
        axios
          .put(`http://localhost:4000/proveedor/actualizar/${_id}`, {
            nombre_marca: nombre_marca_,
            telefono: telefono_,
            correo: correo_,
            sitioweb: sitioweb_,
          }, configInicial)
          .then((response) => {
            const ProveedorActualizado = proveedores.map((proveedor, index) => {
              if (index === miIndex) {
                return {
                  ...proveedor,
                  nombre_marca: nombre_marca_,
                  telefono: telefono_,
                  correo: correo_,
                  sitioweb: sitioweb_,
                };
              } else {
                return proveedor;
              }
            });
            setproveedores(ProveedorActualizado);
            Swal.fire({
              icon: 'success',
              title: 'Proveedor actualizado',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar el Proveedor',
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
    const TipoActual = proveedores[miIndex];
    axios.get(`http://localhost:4000/proveedor/buscar/${TipoActual._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { _id, nombre_marca, telefono, correo, sitioweb} = response;
    
    const correo_ = correo.trim() === "" ? "S/n" : correo;
    let telefono_;
    if (telefono === null || telefono === undefined) {
      telefono_ = "S/n";
    } else {
      telefono_ = '+' + telefono;
    }
    const sitioweb_ = sitioweb.trim() === "" ? "S/n" : sitioweb;
    Swal.fire({
      title: 'Mostrar Proveedor',
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
          <label for="nombre-input">Nombre del Proveedor:</label>
          <input type="text" id="nombre_marca-input" value="${nombre_marca}" class="swal2-input" readonly>
        </div>
        <div class="swal-form-group">
          <label for="correo-input">Correo del Proveedor:</label>
          <input type="text" id="correo-input" value="${correo_}" class="swal2-input" readonly>
        </div>
        <div class="swal-form-group">
          <label for="nombre-input">Telefono del Proveedor:</label>
          <input type="text" id="telefono-input" value="${telefono_}" class="swal2-input" readonly>
        </div>
        <div class="swal-form-group">
          <label for="nombre-input">Sitio Web del Proveedor:</label>
          <input type="text" id="sitioweb-input" value="${sitioweb_}" class="swal2-input" readonly>
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
          .delete(`http://localhost:4000/proveedor/eliminar/${_id}`, configInicial)
          .then((response) => {
            const proveedores_Actualizados = proveedores.filter((e, index) => index !== miIndex);
            setproveedores(proveedores_Actualizados);
            Swal.fire({
              icon: 'success',
              title: 'Tipo eliminado',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el proveedor',
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

  return (
    <div id="Sucursal" style={{ textAlign: 'left',marginRight: '10px',marginLeft:'10px'}}> 
      <Typography variant="h6" component="div" style={{ marginTop: 0, textAlign: 'center',fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a",  paddingLeft: '235px', paddingRight: '235px'   }}>
        LISTA DE PROVEEDORES
      </Typography>
      <div className="table-responsive">
        {
          <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Actualizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              {proveedores.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{x.nombre_marca}</TableCell>
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
