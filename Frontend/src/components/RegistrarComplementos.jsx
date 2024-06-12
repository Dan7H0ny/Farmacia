import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, InputAdornment, Grid, TableCell, Table, TableHead, TableRow, TableBody, TablePagination } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { AddBusiness, ModeEdit, Search } from '@mui/icons-material';

export const RegistrarComplementos = () => {
  const [nombre, setNombreCategoria] = useState('');
  const [nombreTipo, setNombreTipo] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [buscarC, setBuscarC] = useState('');
  const [currentPageC, setCurrentPageC] = useState(0);
  const [rowsPerPageC, setRowsPerPageC] = useState(5);
  const [buscarT, setBuscarT] = useState('');
  const [currentPageT, setCurrentPageT] = useState(0);
  const [rowsPerPageT, setRowsPerPageT] = useState(5);

  const navigate = useNavigate();

  const obtenerToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  const token = obtenerToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'El token es inválido',
        text: "Error al obtener el token de acceso",
      });
      navigate('/Menu/Administrador');
      return;
    }
    const configInicial = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.get('http://localhost:4000/categoria/mostrar', configInicial)
      .then(response => setCategorias(response))
      .catch(error => console.log(error));
  
    axios.get('http://localhost:4000/tipo/mostrar ', configInicial)
      .then(response => setTipos(response))
      .catch(error => console.log(error));
  }, [navigate, token]); // Asegúrate de incluir config aquí
  

  const botonGuardarCategoria = (e) => {
    e.preventDefault();
    const nuevaCategoria = { nombre };
    console.log(nuevaCategoria)
    axios.post('http://localhost:4000/categoria/crear', nuevaCategoria, config)
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Categoría Creada',
          text: response.mensaje,
        });
        limpiarFormulario();
        setCategorias([...categorias, response]);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la categoría',
          text: error.mensaje,
        });
      });
  };

  const botonActualizarCategoria = (categoria) => {
    console.log(categoria)
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
    // Redirigir al login si el token no existe
      Swal.fire({icon: 'error',title: 'El token es invalido',text: "error",});
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`http://localhost:4000/categoria/buscar/${categoria._id}`)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
      const { _id, nombre} = response;
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
      `;
      Swal.fire({
          title: 'ACTUALIZAR COMPONENTE',
          html: table,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const nombre_ = document.getElementById('nombre').textContent;
            return { nombre_ };
          },
          customClass: {
              container: 'my-swal-container', // Clase personalizada para el contenedor principal
          },
          didOpen: () => {
            const nombreInput = document.getElementById('nombre');
            nombreInput.addEventListener('input', function () {
              this.textContent = this.textContent.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
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
        const { nombre_  } = result.value;
        axios.put(`http://localhost:4000/categoria/actualizar/${_id}`, {
            nombre: nombre_,
          })
          .then((response) => {
            const clienteActualizado = categorias.map((categoria) => {
              if (categoria._id === _id) {
                return {
                  ...categoria,
                  nombre: nombre_,
                };
              } else {
                return categoria;
              }
            });
            setCategorias(clienteActualizado);
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

  const botonGuardarTipo = (e) => {
    e.preventDefault();
    const nuevoTipo = { nombreTipo };
    axios.post('http://localhost:4000/tipo/crear', nuevoTipo, config)
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Tipo Creado',
          text: response.mensaje,
        });
        limpiarFormulario();
        setTipos([...tipos, response]);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el tipo',
          text: error.mensaje,
        });
      });
  };

  const botonActualizarTipo = (tipo) => {
    const token = obtenerToken(); // Asegúrate de tener la función obtenerToken para obtener el token
    if (!token) {
    // Redirigir al login si el token no existe
      Swal.fire({icon: 'error',title: 'El token es invalido',text: "error",});
      navigate('/Menu/Administrador')
    }
    else{
    axios.get(`http://localhost:4000/tipo/buscar/${tipo._id}`)
    .then(response => {
      // Acciones a realizar con los datos del usuario encontrado
      const { _id, nombreTipo} = response;
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
              <td contenteditable="true" id="nombre">${nombreTipo}</td>
          </tr>
      `;
      Swal.fire({
          title: 'ACTUALIZAR COMPONENTE',
          html: table,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const nombre_ = document.getElementById('nombre').textContent;
            return { nombre_ };
          },
          customClass: {
              container: 'my-swal-container', // Clase personalizada para el contenedor principal
          },
          didOpen: () => {
            const nombreInput = document.getElementById('nombre');
            nombreInput.addEventListener('input', function () {
              this.textContent = this.textContent.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
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
        const { nombre_  } = result.value;
        axios.put(`http://localhost:4000/tipo/actualizar/${_id}`, {
            nombreTipo: nombre_,
          })
          .then((response) => {
            const tipoActualizado = tipos.map((tipo) => {
              if (tipo._id === _id) {
                return {
                  ...tipo,
                  nombreTipo: nombre_,
                };
              } else {
                return tipo;
              }
            });
            setTipos(tipoActualizado);
            Swal.fire({
              icon: 'success',
              title: 'Tipo actualizado',
              text: response.mensaje,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar el Tipo',
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

  const limpiarFormulario = () => {
    setNombreCategoria('');
    setNombreTipo('');
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPageC(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageC(parseInt(event.target.value, 10));
    setCurrentPageC(0);
  };

  const handleChangeTipo = (event, newPage) => {
    setCurrentPageT(newPage);
  };

  const handleChangeRowsPerTipo = (event) => {
    setRowsPerPageT(parseInt(event.target.value, 10));
    setCurrentPageT(0);
  };

  const CategoriaFiltrado = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(buscarC.toLowerCase())
  );  

  const paginaCategorias = CategoriaFiltrado.slice(currentPageC * rowsPerPageC, currentPageC * rowsPerPageC + rowsPerPageC);

  const tipoFiltrado = tipos.filter(tipo =>
    tipo.nombreTipo.toLowerCase().includes(buscarT.toLowerCase())
  );  

  const paginaTipo = tipoFiltrado.slice(currentPageT * rowsPerPageT, currentPageT * rowsPerPageT + rowsPerPageT);

  return (
    <div id="caja_contenido" style={{ textAlign: 'left', marginRight: '10px', marginLeft: '10px' }}>
      <Typography variant="h6" style={{ marginTop: 50, textAlign: 'center', fontSize: '50px', color: '#eeca06', backgroundColor: "#03112a" }}>
        FORMULARIO DEL REGISTRO DE COMPLEMENTOS
      </Typography>
      <form id="formularioCategoria" style={{ backgroundColor: "#03112a", marginBottom: '20px' }}>
        <Grid container spacing={2} >
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
              label="Nombre de la categoria de busqueda"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={buscarC}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres no permitidos usando una expresión regular
                  const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                  setBuscarC(newValue);
              }}
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
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
              label="Nombre de la categoría"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={nombre}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres no permitidos usando una expresión regular
                  const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                  setNombreCategoria(newValue);
              }}
              required
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <AddBusiness sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }}/>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={botonGuardarCategoria}
              sx={{ backgroundColor: '#eeca06', color: '#03112a' }}>
              Registrar Categoria
            </Button>
          </Grid>
        </Grid>
        <div className="table-responsive">
          <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
              {paginaCategorias.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1 + currentPageC * rowsPerPageC}</TableCell>
                  <TableCell>{x.nombre}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" color="success" onClick={() => botonActualizarCategoria(x)}>
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
              count={CategoriaFiltrado.length}
              page={currentPageC}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPageC}
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
      </form>
      <form id="formularTipo" style={{ backgroundColor: "#03112a", marginBottom: '20px' }}>
        <Grid container spacing={2} >
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
              label="Nombre del tipo de busqueda"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={buscarT}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres no permitidos usando una expresión regular
                  const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                  setBuscarT(newValue);
              }}
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
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
          <TextField
              label="Nombre del Tipo"
              variant="outlined"
              fullWidth
              size="large"
              type='text'
              value={nombreTipo}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres no permitidos usando una expresión regular
                  const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                  setNombreTipo(newValue);
              }}
              required
              InputProps={{
                sx: { color: '#eeca06' },
                startAdornment: (
                  <InputAdornment position="start">
                    <AddBusiness sx={{ color: '#eeca06' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { color: '#eeca06' } }}/>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { backgroundColor: '#060e15' } }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={botonGuardarTipo}
              sx={{ backgroundColor: '#eeca06', color: '#03112a' }}>
              Registrar Tipo
            </Button>
          </Grid>
        </Grid>
        <div className="table-responsive">
          <Table className="table table-bordered table-hover" style={{ marginTop: 12 }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#eeca06', backgroundColor: "#03112a", textAlign: 'center' } }}>
              {paginaTipo.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1 + currentPageT * rowsPerPageT}</TableCell>
                  <TableCell>{x.nombreTipo}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="contained" color="success" onClick={() => botonActualizarTipo(x)}>
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
              count={tipoFiltrado.length}
              page={currentPageT}
              onPageChange={handleChangeTipo}
              rowsPerPage={rowsPerPageT}
              onRowsPerPageChange={handleChangeRowsPerTipo}
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
      </form>
    </div>
  );
};
