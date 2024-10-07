import React, { useState, useEffect,useMemo } from 'react'
import axios from 'axios';
import { Grid, Box, Typography, TextField, Button} from '@mui/material';
import { Search, Inventory, IndeterminateCheckBox, DisabledByDefault, CheckBox, DateRange, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomTablaPedidos from '../components/CustomTablaPedidos';
import CustomPedidos from '../components/CustomPedidos';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CustomActualizarUser from '../components/CustomActualizarUser';
import { createRoot } from 'react-dom/client';

const MySwal = withReactContent(Swal);

export const ListarPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [usuario, setUsuario] = useState('');
  const usuario_ = localStorage.getItem('id');
  const navigate = useNavigate();

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({headers: { Authorization: `Bearer ${token}` }}), [token]);
  const configSubir = useMemo(() => ({headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }}), [token]);

  useEffect(() => {
    axios.get(`${UrlReact}/usuario/buscar/${usuario_}`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setUsuario(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact, usuario_]);

  useEffect(() => {
    axios.get(`${UrlReact}/pedidos/mostrar`, configInicial )
      .then(response => {
        setPedidos(response);
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact]);
  
  const btnConfirmar = async (pedido) => {
    if (pedido.estado !== 'Pendiente') {
      CustomSwal({
        icono: 'error',
        titulo: 'No puede ingresar',
        mensaje: `El estado del pedido ya ha sido modificado a: ${pedido.estado}`
      });
    } else {
      const productosJsx = pedido.productos.map((productoItem, index) => (
        <React.Fragment key={productoItem.producto._id}> {/* Asegúrate de usar un ID único aquí */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ textAlign: 'left', textTransform: 'uppercase', marginTop: 2 }}>
              {productoItem.nombre} ({productoItem.tipo}):
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={`Cantidad (máx: ${productoItem.cantidad_producto})`}
              type="number"
              InputProps={{
                inputProps: { min: 0, max: productoItem.cantidad_producto }
              }}
              defaultValue={productoItem.cantidad_producto}
              fullWidth
              id={`cantidadInput${index}`}
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                '& .MuiInputBase-root': {
                  backgroundColor: '#e2e2e2',
                  color: '#0f1b35',
                },
                '& .MuiInputLabel-root': {
                  color: '#0f1b35',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e2e2e2',
                  },
                },
              }}
            />
          </Grid>
        </React.Fragment>
      ));
  
      try {
        const result = await MySwal.fire({
          title: '¿Estás seguro de realizar esta operación?',
          html: (
            <Grid container spacing={2} sx={{ marginTop: 2, backgroundColor: '#0f1b35', padding: 2, borderRadius: 1 }}>
              {productosJsx}
              <Grid item xs={12} sm={6} >
                <Typography variant="body1" sx={{ fontWeight: 'bold', color:'#e2e2e2' }}>Subir el archivo de prueba del pedido si es necesario:</Typography>
                <input
                  type="file"
                  name="imagenVerificado"
                  accept="image/*,application/pdf"
                  onChange={(e) => e.target.files[0]}
                  style={{
                    width: '100%',
                    backgroundColor: '#e2e2e2',
                    color: '#0f1b35',
                    border: '2px solid #0f1b35',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontFamily: 'Arial, sans-serif',
                    textTransform: 'uppercase',
                    outline: 'none',
                    transition: '0.3s',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#1a7b13')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#e2e2e2')}
                />
              </Grid>
              <Grid item xs={6} sx={{marginTop: 2.2}}>
                <TextField
                  label="Contraseña del usuario actual"
                  type="password"
                  fullWidth
                  id="passwordInput"
                  sx={{
                    backgroundColor: '#e2e2e2',
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e2e2e2',
                      color: '#0f1b35',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0f1b35',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#0f1b35',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          ),
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar Pedido',
          customClass: {
            popup: 'customs-swal-popup',
            title: 'customs-swal-title',
            confirmButton: 'swal2-confirm custom-swal2-confirm',
            cancelButton: 'swal2-cancel custom-swal2-cancel',
          },
          preConfirm: () => {
            const cantidades = pedido.productos.map((productoItem, index) => {
              const cantidad = document.getElementById(`cantidadInput${index}`).value;
              return { producto: productoItem.producto._id, cantidad: parseInt(cantidad, 10) };
            });
            const alMenosUnoValido = cantidades.some(c => c && c.cantidad > 0);
  
            if (!alMenosUnoValido) {
              Swal.showValidationMessage('Al menos un producto debe tener una cantidad mayor a 0.');
              return false;
            }
  
            const password = document.getElementById('passwordInput').value;
            if (!password) {
              Swal.showValidationMessage('Debe ingresar una contraseña');
              return false;
            }
  
            return { cantidades, password };
          }
        });
  
        const file = document.querySelector('input[name="imagenVerificado"]').files[0]; // Obtener el archivo seleccionado directamente
        if (file && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
          return CustomSwal({ icono: 'error', titulo: 'Error', mensaje: 'Solo se permiten imágenes (JPG, PNG) o archivos PDF' });
        }
  
        // Verificación del tamaño del archivo (máximo 10 MB)
        const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB en bytes
        if (file && file.size > maxSizeInBytes) {
          return CustomSwal({ icono: 'error', titulo: 'Error', mensaje: 'El tamaño máximo permitido para el archivo es de 10 MB' });
        }
  
        if (result.isConfirmed) {
          const { cantidades, password } = result.value;
          const formData = new FormData();
  
          formData.append('productos', JSON.stringify(cantidades));
          formData.append('estado', 'Confirmado');
          formData.append('correo', usuario.correo);
          formData.append('password', password);
  
          if (file) {
            formData.append('imagenVerificado', file); // Adjunta la imagen seleccionada
          }
  
          const response = await axios.put(`${UrlReact}/pedidos/actualizar/${pedido._id}`, formData, configSubir);
          setPedidos(response.pedidos);
          CustomSwal({ icono: 'success', titulo: 'Pedido Confirmado', mensaje: response.mensaje });
        }
      } catch (error) {
        CustomSwal({ icono: 'error', titulo: 'No se ha completado el proceso', mensaje: error.mensaje });
      }
    }
  };  

  const btnRechazar = async (pedido) => {
    if (pedido.estado !== 'Pendiente') {
      CustomSwal({
        icono: 'error',
        titulo: 'No puede ingresar',
        mensaje: `El estado del pedido ya ha sido modificado a: ${pedido.estado}`
      });
    } else {
  
      try {
        const result = await MySwal.fire({
          title: '¿Estás seguro de realizar esta operación?',
          html: (
            <Grid container spacing={2} sx={{ marginTop: 2, backgroundColor: '#0f1b35', padding: 2, borderRadius: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña del usuario actual"
                  type="password"
                  fullWidth
                  id="passwordInput"
                  sx={{
                    backgroundColor: '#e2e2e2',
                    '& .MuiInputBase-root': {
                      backgroundColor: '#e2e2e2', // Fondo del campo
                      color: '#0f1b35', // Color del texto
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0f1b35', // Color de la etiqueta
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#0f1b35', // Color del borde
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          ),
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar Pedido',
          customClass: {
            popup: 'customs-swal-popup',
            title: 'customs-swal-title',
            confirmButton: 'swal2-confirm custom-swal2-confirm',
            cancelButton: 'swal2-cancel custom-swal2-cancel',
          },
          preConfirm: () => {
            const password = document.getElementById('passwordInput').value;
            if (!password) {
              Swal.showValidationMessage('Debe ingresar una contraseña');
              return false;
            }
  
            return { password };
          }
        });
  
        if (result.isConfirmed) {
          const { password } = result.value;
          const response = await axios.put(`${UrlReact}/pedidos/actualizar/${pedido._id}`, {estado: 'Rechazado', correo: usuario.correo, password}, configInicial);
  
          setPedidos(prevPedidos =>
            prevPedidos.map(p =>
              p._id === pedido._id ? { ...p, estado: 'Rechazado' } : p
            )
          );
  
          CustomSwal({ icono: 'success', titulo: 'Pedido Rechazado', mensaje: response.mensaje });
        }
      } catch (error) {
        CustomSwal({ icono: 'error', titulo: 'No se ha completado el proceso', mensaje: error.mensaje });
      }
    }
  };  
  const botonMostrar = (pedido) => {
    axios.get(`${UrlReact}/pedidos/buscar/${pedido._id}`, configInicial)
      .then(response => {
        const { productos, estado, proveedor, precio_total, imagenPrueba, imagenVerificado, usuario_registro, usuario_actualizacion, fecha_registro, fecha_actualizacion } = response;
        const fechaRegistro = fecha_registro ? formatDateTime(new Date(fecha_registro)) : '';
        const fechaActualizacion = fecha_actualizacion ? formatDateTime(new Date(fecha_actualizacion)) : '';
  
        function formatDateTime(date) {
          const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
          const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
          const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
          const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
          return `${formattedDate} ${formattedTime}`;
        }
  
        const container = document.createElement('div');
        const root = createRoot(container);
        let newEstado = '';
        let estadoIcon = null;
        if (estado === 'Pendiente') {
          newEstado = 'Pendiente';
          estadoIcon = <IndeterminateCheckBox style={{ color: 'lightblue' }} />;
        } else if (estado === 'Rechazado') {
          newEstado = 'Rechazado';
          estadoIcon = <DisabledByDefault style={{ color: 'red' }} />;
        } else if (estado === 'Confirmado') {
          newEstado = 'Confirmado';
          estadoIcon = <CheckBox style={{ color: 'green' }} />;
        }
  
        const imagenPruebaUrl = `${UrlReact}/uploads/${imagenPrueba}`;
        const imagenVerificadoUrl = `${UrlReact}/uploads/${imagenVerificado}`;
  
        root.render(
          <Grid container spacing={2}>
            <Grid item xs={12}><CustomPedidos productos={productos} /></Grid>
            <CustomActualizarUser number={6} label="Nombre del Proveedor" defaultValue={proveedor} readOnly={true} icon={<Inventory />} />
            <CustomActualizarUser number={3} label="Precio Total" defaultValue={precio_total} readOnly={true} icon={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs</Typography>} />
            <CustomActualizarUser number={3} label="Estado del Pedido" defaultValue={newEstado} readOnly={true} icon={estadoIcon} showIconOnly={true} />
            <CustomActualizarUser number={6} label="Fecha de Registro" defaultValue={fechaRegistro} readOnly={true} icon={<DateRange />} />
            <CustomActualizarUser number={6} label="Fecha de Edicion" defaultValue={fechaActualizacion} readOnly={true} icon={<DateRange />} />
            <CustomActualizarUser number={6} label="Usuario de Registro" defaultValue={`${usuario_registro.nombre} - ${usuario_registro.apellido} - ${usuario_registro.rol}`} readOnly={true} icon={<Person />} />
            <CustomActualizarUser number={6} label="Usuario de Edicion" defaultValue={`${usuario_actualizacion.nombre} - ${usuario_actualizacion.apellido} - ${usuario_actualizacion.rol}`} readOnly={true} icon={<Person />} />
            
            {/* Botones de descarga */}
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>
                {imagenPrueba && (
                  <Button variant="contained" onClick={() => descargarArchivo(pedido._id, 'imagenPrueba')}>
                    Descargar Imagen Prueba
                  </Button>
                )}
              </Grid>
              <Grid item>
                {imagenVerificado && (
                  <Button variant="contained" onClick={() => descargarArchivo(pedido._id, 'imagenVerificado')}>
                    Descargar Imagen Verificado
                  </Button>
                )}
              </Grid>
            </Grid>
  
            {/* Previsualización de las imágenes o PDF */}
            <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2}>
              <Grid item>
                {imagenPrueba && (
                  <>
                    {imagenPruebaUrl.endsWith('.pdf') ? (
                      <embed src={imagenPruebaUrl} type="application/pdf" width="200px" height="auto" />
                    ) : (
                      <img src={imagenPruebaUrl} alt="Imagen Prueba" style={{ width: '200px', height: 'auto' }} />
                    )}
                  </>
                )}
              </Grid>
              <Grid item>
                {imagenVerificado && (
                  <>
                    {imagenVerificadoUrl.endsWith('.pdf') ? (
                      <embed src={imagenVerificadoUrl} type="application/pdf" width="200px" height="auto" />
                    ) : (
                      <img src={imagenVerificadoUrl} alt="Imagen Verificado" style={{ width: '200px', height: 'auto' }} />
                    )}
                  </>
                )}
              </Grid>
            </Grid>
  
            {/* Botones adicionales: Imprimir, Eliminar, Atras */}
            <Grid container spacing={2} justifyContent="center" alignItems="center" mt={4}>
              <Grid item>
                <Button variant="contained" onClick={() => window.print()} sx={{backgroundColor:'green'}}>
                  Imprimir
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="error" onClick={() => eliminarPedido(pedido._id)}>
                  Eliminar
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={() => Swal.close()}>
                  Atrás
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
  
        Swal.fire({
          title: 'DATOS DEL PRODUCTO EN EL ALMACEN',
          html: container,
          showCancelButton: false, // Se quitan los botones por defecto de Swal
          showConfirmButton: false, // Se quita el botón "OK" por defecto de Swal
          customClass: {
            popup: 'customs-swal-popup',
            title: 'customs-swal-title',
          },
        });
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: error });
      });
  };
  
  // Función para descargar archivo
  const descargarArchivo = (pedidoId, nombreArchivo) => {
    axios({
      url: `${UrlReact}/pedidos/descargar/${pedidoId}/${nombreArchivo}`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: response.type }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nombreArchivo);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error al descargar el archivo:', error);
      });
  };
  const eliminarPedido = async (pedidoId) => {
    try {
      const result = await MySwal.fire({
        title: '¿Estás seguro de realizar esta operación?',
        html: (
          <Grid container spacing={2} sx={{ marginTop: 2, backgroundColor: '#0f1b35', padding: 2, borderRadius: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Contraseña del usuario actual"
                type="password"
                fullWidth
                id="passwordInput"
                sx={{
                  backgroundColor: '#e2e2e2',
                  '& .MuiInputBase-root': {
                    backgroundColor: '#e2e2e2', // Fondo del campo
                    color: '#0f1b35', // Color del texto
                  },
                  '& .MuiInputLabel-root': {
                    color: '#0f1b35', // Color de la etiqueta
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#0f1b35', // Color del borde
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        ),
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar Pedido',
        customClass: {
          popup: 'customs-swal-popup',
          title: 'customs-swal-title',
          confirmButton: 'swal2-confirm custom-swal2-confirm',
          cancelButton: 'swal2-cancel custom-swal2-cancel',
        },
        preConfirm: () => {
          const password = document.getElementById('passwordInput').value;
          if (!password) {
            Swal.showValidationMessage('Debe ingresar una contraseña');
            return false;
          }

          return { password };
        }
      });

      if (result.isConfirmed) {
        const { password } = result.value;
        const response = await axios.delete(`${UrlReact}/pedidos/eliminar/${pedidoId}`, {
          data: {
              correo: usuario.correo,
              password,
          },
          ...configInicial,
      });
      setPedidos(prevPedidos => prevPedidos.filter(p => p._id !== pedidoId));
      

        CustomSwal({ icono: 'success', titulo: 'Pedido Rechazado', mensaje: response.mensaje });
      }
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'No se ha completado el proceso', mensaje: error.mensaje });
    }
  };
  
 
  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Lista de Pedidos'} />
        <form id="Form-1" className="custom-form" style={{ padding: 15}}>
          <Grid container spacing={2} >
            <CustomRegisterUser
              number={8}
              label="Buscar"  
              placeholder= 'Buscar por producto, categoria y fecha de caducidad'
              type= 'text'
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              required={false}
              icon={<Search/>}
            />
            {/* <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
              <ReporteExcelAlmacen
                data={almacen}
                fileName="Reporte del almacen"
                sheetName="almacen"
                sx={{ mt: 2 }}
              />
            </Grid> */}
          </Grid>
        </form>
        <CustomTablaPedidos pedidos={pedidos} buscar={buscar} botonAceptar={btnConfirmar} botonRechazar={btnRechazar} botonMostrar={botonMostrar}/>
      </Box>
    </div>
  )
}
