import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomMensajePedido from '../components/CustomMensajePedido';
import CustomAutocompletePedido from '../components/CustomAutocompletePedido';
import { AddBusiness, SupervisedUserCircle } from '@mui/icons-material';
import CustomListaProductosPedir from '../components/CustomListaProductosPedir';

export const RegistrarPedido = () => {

  const { pedidoId } = useParams();
  const [proveedor, setProveedor] = useState('');
  const [productos, setProductos] = useState([]);
  const [productosAñadidos, setProductosAñadidos] = useState([]);
  const [productosElegidos, setProductosElegidos] = useState([]);
  const usuario_ = localStorage.getItem('id');
  const [inputValue, setInputValue] = useState('');
  const [cantidad, setCantidad] = useState({});
  const [precioTotal, setPrecioTotal] = useState(0);
  const [user, setUser] = useState('');
  const [imagenPrueba, setImagenPrueba] = useState(null);
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
        else {setUser(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact, usuario_]);

  useEffect(() => {
    axios.get(`${UrlReact}/proveedor/buscar/${pedidoId}`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setProveedor(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact, pedidoId]);

  useEffect(() => {
    axios.get(`${UrlReact}/producto/mostrar/por-proveedor/${pedidoId}`,  configInicial )
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setProductos(response);}
      })
      .catch(error => { console.log(error);});
  },[navigate, token, configInicial, UrlReact, pedidoId]);

  useEffect(() => {
    const updatedProductosElegidos = productosAñadidos.map(producto => {
      // Verificación para asegurar que todas las propiedades necesarias existen
      const nombreProducto = producto?.nombre || 'Nombre no disponible';
      const tipoProducto = producto.tipo.nombre;
      const cantidadProducto = cantidad[producto._id] || 1;
      const precioVentaProducto = producto?.precioCompra || 0;
      return {
        producto: producto._id,
        nombre: nombreProducto,
        tipo: tipoProducto,
        cantidad_producto: cantidadProducto,
        precioCompra: precioVentaProducto,
      };
    });
    setProductosElegidos(updatedProductosElegidos);
  }, [cantidad, productosAñadidos]);

  const handleFileChange = (e) => {
    if (e.target.name === 'imagenPrueba') {
      setImagenPrueba(e.target.files[0]);
    } 
  };

  const btnRegistrarPedido = (e) => {
    e.preventDefault();
    // Validación de productos
    if (!productosAñadidos.length) {
      return CustomSwal({ icono: 'error', titulo: 'No se puede Crear el pedido', mensaje: 'Seleccione los productos que va a pedir al proveedor' });
    }
  
    // Verificación del tipo de archivo
    if (imagenPrueba && !['image/jpeg', 'image/png', 'application/pdf'].includes(imagenPrueba.type)) {
      return CustomSwal({ icono: 'error', titulo: 'Error', mensaje: 'Solo se permiten imágenes (JPG, PNG) o archivos PDF' });
    }
  
    // Verificación del tamaño del archivo (máximo 10 MB)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB en bytes
    if (imagenPrueba && imagenPrueba.size > maxSizeInBytes) {
      return CustomSwal({ icono: 'error', titulo: 'Error', mensaje: 'El tamaño máximo permitido para el archivo es de 10 MB' });
    }
  
    const formData = new FormData();

    // Serializar solo los arrays/objetos
    formData.append('productos', JSON.stringify(productosElegidos)); // Array de productos
    formData.append('proveedor', proveedor.nombre_marca); // Precio como número
    formData.append('precio_total', precioTotal);
    formData.append('usuario', user._id); // Usuario como cadena de texto
    if (imagenPrueba) {
      formData.append('imagenPrueba', imagenPrueba);
    }
    // Envío de la solicitud
    axios.post(`${UrlReact}/pedidos/crear`, formData, configSubir)
      .then(response => {
        CustomSwal({ icono: 'success', titulo: 'Pedido Creado', mensaje: response.mensaje });
        limpiarFormulario();
      })
      .catch(error => {
        console.error(error);
        CustomSwal({ icono: 'error', titulo: 'Error', mensaje: error.mensaje }); // Usar error.message
      });
  };  
  
  const limpiarFormulario = () => {
    setProductosAñadidos([]);
    setProductosElegidos([]);
  }

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registrar una pedido'} />
        <form id="Form-1" onSubmit={btnRegistrarPedido} className="custom-form">
        <Grid container spacing={3}>
          <CustomRegisterUser
            number={6}
            label="Nombre del Proveedor"
            type='text'
            value={proveedor.nombre_marca || ''}
            readOnly={true}
            icon={<AddBusiness/>}
          />
          <CustomRegisterUser
            number={6}
            label="Nombre del vendedor"
            type='text'
            value={proveedor.nombre_vendedor || ''}
            readOnly={true}
            icon={<SupervisedUserCircle/>}
          />
          <CustomAutocompletePedido productos={productos} productosAñadidos={productosAñadidos} setProductosAñadidos={setProductosAñadidos} inputValue={inputValue} setInputValue={setInputValue}/>
          <CustomListaProductosPedir productosAñadidos={productosAñadidos} setCantidad={setCantidad} cantidad={cantidad} setPrecioTotal={setPrecioTotal}/>
          {productosAñadidos.length && (
            <CustomMensajePedido proveedor={proveedor} user={user} predicciones={productosElegidos}/>
          )}
          {productosAñadidos.length && (
            <>
              <Grid item xs={12} sm={8} >
                <Typography variant="body1" sx={{ fontWeight: 'bold', color:'#e2e2e2' }}>Subir el archivo de prueba del pedido si es necesario:</Typography>
                <input
                  type="file"
                  name="imagenPrueba"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
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
              <CustomRegisterUser
                number={4}
                label="Precio Total"
                type='Number'
                value={precioTotal.toFixed(2)}
                onChange={(e) => {setPrecioTotal(e.target.value)}}
                required={true}
                readOnly={true}
                icon={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs</Typography>}
              />
            </>
          )}
          <Grid item xs={12} sm={12}>
          <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  backgroundColor: '#e2e2e2',
                  color: '#0f1b35',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#1a7b13',
                    color: '#e2e2e2',
                    border: '2px solid #e2e2e2',
                    },
                  }}
                >Registrar Pedido
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="button" // Cambiado de 'submit' a 'button' si no es un formulario
                onClick={() => navigate(`/Menu/Administrador/Proveedor/Listar`)}
                sx={{
                  backgroundColor: '#e2e2e2',
                  color: '#0f1b35',
                  marginTop: 2.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#1a7b13',
                    color: '#e2e2e2',
                    border: '2px solid #e2e2e2',
                    },
                  }}
                >Volver a la lista de proveedores
              </Button>
          </Grid>
        </Grid>
        </form>
      </Box>
    </div>
  );
};
