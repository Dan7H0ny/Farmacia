import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomAutocompleteCliente from '../components/CustomAutocompleteCliente';
import CustomAutocompleteProducto from '../components/CustomAutocompleteProducto';
import CustomListaProductos from '../components/CustomListaProductos';

export const ActualizarVenta = () => {
  const { ventaId } = useParams();
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [idcliente, setIdCliente] = useState(null);
  const [inputCliente, setInputCliente] = useState('');  
  const [inputValue, setInputValue] = useState('');
  const [productosAñadidos, setProductosAñadidos] = useState([]);
  const [productosElegidos, setProductosElegidos] = useState([]);
  const [cantidad, setCantidad] = useState({});
  const [precioTotal, setPrecioTotal] = useState(0);
  const usuario_ = localStorage.getItem('id');
  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  useEffect(() => {
    axios.get(`${UrlReact}/venta/buscar/${ventaId}`, configInicial)
      .then(response => {
        const detalles = response.productos.map(producto => {
          return axios.get(`${UrlReact}/almacen/buscar/${producto.producto}`, configInicial)
            .then(res => {
              return { ...res, productoId:producto.producto, cantidadProducto: producto.cantidad_producto};
            })
        });
        Promise.all(detalles)
          .then(productosDetallados => {
            // Construir un objeto para almacenar las cantidades iniciales
            const cantidadesIniciales = {};
            productosDetallados.forEach(producto => {
              cantidadesIniciales[producto._id] = producto.cantidadProducto;
            });

            // Actualizar productosDetallados con la cantidad_stock actualizada
            const productosActualizados = productosDetallados.map(producto => {
              const cantidadProducto = cantidadesIniciales[producto._id] || 0; // Valor por defecto 0 si no existe
              return {
                ...producto,
                cantidad_stock: producto.cantidad_stock + cantidadProducto // Actualiza cantidad_stock
              };
            });

            // Actualizar el estado
            setProductosAñadidos(productosActualizados);
            setCantidad(cantidadesIniciales);
          })
          .catch(error => {
            console.error('Error al cargar detalles de productos:', error);
            CustomSwal({ icono: 'error', titulo: 'Error al cargar detalles de productos', mensaje: error.mensaje || error.message });
          });

        // Configurar cliente y precio total
        const clienteCompleto = response.cliente;
        setIdCliente(clienteCompleto);
        setInputCliente(clienteCompleto.nombreCompleto + ' ' + clienteCompleto.numberIdentity);
        setPrecioTotal(response.precio_total);
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener la venta', mensaje: error.mensaje || error.message });
        navigate('/Menu/Administrador');
      });
  }, [ventaId, configInicial, UrlReact, navigate]);

  useEffect(() => {
    // Actualizar productosElegidos basándonos en la cantidad actualizada
    const updatedProductosElegidos = productosAñadidos.map(producto => {
      // Verificación para asegurar que todas las propiedades necesarias existen
      const nombreProducto = producto?.producto?.nombre || 'Nombre no disponible';
      const tipoProducto = producto?.producto?.tipo?.nombre || 'Tipo no disponible';
      const proveedorProducto = producto?.producto?.proveedor?.nombre_marca || 'Proveedor no disponible';
      const categoriaProducto = producto?.categoria?.nombre || 'Categoría no disponible';
      const cantidadProducto = cantidad[producto._id] || 1;
      const precioVentaProducto = producto?.precioVenta || 0;
  
      return {
        producto: producto._id,
        nombre: nombreProducto,
        tipo: tipoProducto,
        proveedor: proveedorProducto,
        categoria: categoriaProducto,
        cantidad_producto: cantidadProducto,
        precio_venta: precioVentaProducto,
      };
    });
    setProductosElegidos(updatedProductosElegidos);
  }, [cantidad, productosAñadidos]);
  
  useEffect(() => {
    // Calcular el precio total basado en los productos y cantidades
    const total = productosAñadidos.reduce((acc, producto) => {
      const cant = cantidad[producto._id] || 1; // Valor por defecto 1
      return acc + (cant * producto.precioVenta);
    }, 0);
    setPrecioTotal(total);
  }, [cantidad, productosAñadidos]);

  useEffect(() => {
    axios.get(`${UrlReact}/almacen/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
          navigate('/Menu/Administrador');
        } else {
          const productosFiltrados = response.filter(producto => producto.estado === true);
          setProductos(productosFiltrados);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate, token, configInicial, UrlReact]);

  useEffect(() => {
    axios.get(`${UrlReact}/cliente/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
          navigate('/Menu/Administrador');
        } else {
          setClientes(response); 
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate, token, configInicial, UrlReact]);

  const btnActualizarVenta= (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    } 
    else 
    {
      const miventa = { 
        cliente:idcliente, 
        productos: productosElegidos, 
        precio_total:precioTotal, 
        usuario:usuario_
      };
      axios.put(`${UrlReact}/venta/actualizar/${ventaId}`, miventa, configInicial)
        .then(response => {
          CustomSwal({ icono: 'success', titulo: 'Venta Actualizada', mensaje: response.mensaje});
          if(rol === 'Administrador'){
            navigate(`/Menu/Administrador/Venta/Listar`);
          }
          else{
            navigate(`/Menu/Cajero/Venta/Listar`);
          }
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'Error al actualizar la venta', mensaje: error.mensaje});
        });
    }
  }

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Actualizar la venta'} />
        <form id="Form-1" onSubmit={btnActualizarVenta} className="custom-form">
        <Grid container spacing={2}>
          <CustomAutocompleteCliente clientes={clientes} setClientes={setClientes} idcliente={idcliente} setIdCliente={setIdCliente} inputCliente={inputCliente} setInputCliente={setInputCliente} usuario_={usuario_}/>
          <CustomAutocompleteProducto productos={productos} productosAñadidos={productosAñadidos} setProductosAñadidos={setProductosAñadidos} inputValue={inputValue} setInputValue={setInputValue}/>
          <CustomListaProductos productosAñadidos={productosAñadidos} setCantidad={setCantidad} cantidad={cantidad}/>
          <CustomRegisterUser
            number={12}
            label="Precio Total"
            type='Number'
            value={precioTotal.toFixed(1)}
            onChange={(e) => {setPrecioTotal(e.target.value)}}
            required={true}
            readOnly={true}
            icon={<AttachMoney />}
          />
          <Grid item xs={12} sm={6} sx={{padding: 'auto',}}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
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
              >Actualizar el Producto
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} sx={{padding: 'auto',}}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="button" // Cambiado de 'submit' a 'button' si no es un formulario
              onClick={() => navigate(`/Menu/Administrador/Venta/Listar`)}
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
              >Volver a la lista de ventas
            </Button>
          </Grid> 
        </Grid>
        </form>
      </Box>
    </div>
  );
};
