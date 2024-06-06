import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Visibility, FormatQuote } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const ListarCliente = () => {

  const [clientes, setClientes] = useState([]);
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

  const botonActualizar = (miIndex) => {
    const token = obtenerToken();
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
    const clienteActual = clientes[miIndex]; 
    axios.get(`http://localhost:4000/cliente/buscar/${clienteActual._id}`,configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { _id, nombre, apellido, nit_ci_cex, fecha_registro } = response;
    const date = new Date(fecha_registro);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

    Swal.fire({
      title: 'Actualizar Cliente',
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
        <label for="nombre-input">Nombre completo del cliente:</label>
        <input type="text" id="nombre-input" value="${nombre}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="apellido-input">Apellido completo del cliente:</label>
        <input type="text" id="apellido-input" value="${apellido}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="nit_ci_cex-input">Identificacion NIT/CI/CEX:</label>
        <input type="text" id="nit_ci_cex-input" value="${nit_ci_cex}" class="swal2-input" required>
      </div>
      <div class="swal-form-group">
        <label for="fecha_registro-input">Fecha de creacion del Cliente:</label>
        <input type="text" id="fecha_registro-input" value="${formattedDate}" class="swal2-input" readonly>
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
        const nit_ci_cex_ = Swal.getPopup().querySelector('#nit_ci_cex-input').value;
        return { nombre_, apellido_, nit_ci_cex_ };
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
        const { nombre_, apellido_, nit_ci_cex_ } = result.value;
        axios
          .put(`http://localhost:4000/cliente/actualizar/${_id}`, {
            nombre: nombre_,
            apellido: apellido_,
            nit_ci_cex: nit_ci_cex_,
          }, configInicial)
          .then((response) => {
            const clienteActualizado = clientes.map((cliente, index) => {
              if (index === miIndex) {
                return {
                  ...cliente,
                  nombre: nombre_,
                  apellido: apellido_,
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
              title: 'Error al actualizar el cliente',
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
        text: "Error al obtener el token de acceso",
      });
      navigate('/Menu/Administrador')
    }
    else{
    const clienteActual = clientes[miIndex];
    if(rol === 'Cajero')
      {Swal.fire({
        icon: 'error', 
        title: 'Error al eliminar el cliente',
        text: 'Usted no tiene los permisos para eliminar un cliente', 
      });
      navigate('/Menu/Cajero/Cliente/Listar')
    }
    axios.get(`http://localhost:4000/cliente/buscar/${clienteActual._id}`, configInicial)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
    const { _id, nombre, apellido, nit_ci_cex, fecha_registro } = response;
    const date = new Date(fecha_registro);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    Swal.fire({
      title: 'Mostrar los datos del Cliente',
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
          <label for="nombre-input">Nombre completo del cliente:</label>
          <input type="text" id="nombre-input" value="${nombre}" class="swal2-input" readonly>
        </div>
        <div class="swal-form-group">
          <label for="apellido-input">Apellido completo del cliente:</label>
          <input type="text" id="apellido-input" value="${apellido}" class="swal2-input" readonly>
        </div>
        <div class="swal-form-group">
          <label for="nit_ci_cex-input">Identificacion NIT/CI/CEX:</label>
          <input type="text" id="nit_ci_cex-input" value="${nit_ci_cex}" class="swal2-input" readonly>
        </div>
        <div class="swal-form-group">
          <label for="fecha_registro-input">Fecha de creacion del Cliente:</label>
          <input type="text" id="fecha_registro-input" value="${formattedDate}" class="swal2-input" readonly>
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
        axios.delete(`http://localhost:4000/cliente/eliminar/${_id}`, {
            data: { rol }, // Enviamos el rol en el cuerpo de la solicitud
            ...configInicial // Mantener la configuración inicial
          })
          .then((response) => {
            const tipos_Actualizados = clientes.filter((e, index) => index !== miIndex);
            setClientes(tipos_Actualizados);
            Swal.fire({
              icon: 'success',
              title: 'Cliente eliminado',
              text: response.mensaje,
            });
            console.log("nuevo", rol)
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el cliente',
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
    <div id="Sucursal" style={{ textAlign: 'left', marginRight: '10px', marginLeft:'10px'}}> 
      <Typography variant="h6" component="div" style={{ marginTop: 0, textAlign: 'center',fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a",  paddingLeft: '235px', paddingRight: '235px'   }}>
        LISTA DE CLIENTES
      </Typography>
      <div className="table-responsive">
        {
          <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Identificacion CI/NIT/CEX</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Actualizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a" } }}>
              {clientes.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{x.nombre}</TableCell>
                  <TableCell>{x.nit_ci_cex}</TableCell>
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
