import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomAutocompleteCliente from '../components/CustomAutocompleteCliente';
import CustomAutocompleteProducto from '../components/CustomAutocompleteProducto';
import CustomListaProductos from '../components/CustomListaProductos';

export const RegistrarVenta = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [idcliente, setIdCliente] = useState(null);
  const [inputCliente, setInputCliente] = useState('');  
  const [inputValue, setInputValue] = useState('');
  const [productosAñadidos, setProductosAñadidos] = useState([]);
  const [productosElegidos, setProductosElegidos] = useState([]);
  const usuario_ = localStorage.getItem('id');
  const navigate = useNavigate();
  const [reloadProductos, setReloadProductos] = useState(false);

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({headers: { Authorization: `Bearer ${token}` }}), [token]);

  const [cantidad, setCantidad] = useState({});
  const [tiposSeleccionados, setTiposSeleccionados] = useState({});
  const [precioTotal, setPrecioTotal] = useState(0);

  useEffect(() => {
    // Actualizar productosElegidos basándonos en la cantidad actualizada
    const updatedProductosElegidos = productosAñadidos.map(producto => {
      // Verificación para asegurar que todas las propiedades necesarias existen
      const nombreProducto = producto?.producto?.nombre || 'Nombre no disponible';
      const tipoProducto = producto?.producto?.tipo?.nombre || 'Tipo no disponible';
      const proveedorProducto = producto?.producto?.proveedor?.nombre_marca || 'Proveedor no disponible';
      const categoriaProducto = producto?.categoria?.nombre || 'Categoría no disponible';
  
      // Definir estado y asegurarse de que sea 'Unidades' si no está definido
      const tipoSeleccionado = tiposSeleccionados[producto._id] || 'Unidades'; // Usar 'Unidades' si no existe
      const estado = tipoSeleccionado === 'Unidades'; // true si es 'Unidades', de lo contrario false
      // Definir cantidadProducto antes de la condición
      let cantidadProducto;
  
      // Asignar valor a cantidadProducto según el estado
      if (estado) {
        cantidadProducto = cantidad[producto._id] || 1; // Unidades
      } else {
        cantidadProducto = (cantidad[producto._id] || 1) * producto.producto.capacidad_presentacion; // Cajas
      }
  
      const precioVentaProducto = (producto?.precioVenta || 0) * cantidadProducto;
  
      return {
        producto: producto._id,
        nombre: nombreProducto,
        tipo: tipoProducto,
        proveedor: proveedorProducto,
        categoria: categoriaProducto,
        estado: estado,
        cantidad_producto: cantidadProducto,
        precio_venta: precioVentaProducto,
      };
    });
  
    setProductosElegidos(updatedProductosElegidos);
  }, [cantidad, productosAñadidos, tiposSeleccionados]);
  
  

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
  }, [navigate, token, configInicial, UrlReact, reloadProductos]);

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

  const btnRegistrarVenta= (e) => {
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
      axios.post(`${UrlReact}/venta/crear`, miventa, configInicial)
        .then(response => {
          CustomSwal({ icono: 'success', titulo: 'Venta Creado', mensaje: response.mensaje});
          limpiarFormulario();
          setReloadProductos(prev => !prev);
        })
        .catch(error => {
          console.log(error)
          CustomSwal({ icono: 'error', titulo: 'Error al crear la venta', mensaje: error.mensaje});
        });
    }
  }

  const limpiarFormulario = () => {
    setIdCliente(null);
    setProductosAñadidos([]);
    setProductosElegidos([]);
    setInputValue("");
    setInputCliente("");
    setPrecioTotal(0);
    setProductos([]);
  }

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registrar una venta'} />
        <form id="Form-1" onSubmit={btnRegistrarVenta} className="custom-form">
        <Grid container spacing={3}>
          <CustomAutocompleteCliente clientes={clientes} setClientes={setClientes} idcliente={idcliente} setIdCliente={setIdCliente} inputCliente={inputCliente} setInputCliente={setInputCliente} usuario_={usuario_}/>
          <CustomAutocompleteProducto productos={productos} productosAñadidos={productosAñadidos} setProductosAñadidos={setProductosAñadidos} inputValue={inputValue} setInputValue={setInputValue}/>
          <CustomListaProductos productosAñadidos={productosAñadidos} setCantidad={setCantidad} cantidad={cantidad} setPrecioTotal={setPrecioTotal} tiposSeleccionados={{}} setTiposSeleccionados={setTiposSeleccionados}/>
          <Grid item xs={12} sm={8}></Grid>
          <CustomRegisterUser
            number={4}
            label="Precio Total"
            type='Number'
            value={precioTotal.toFixed(1)}
            onChange={(e) => {setPrecioTotal(e.target.value)}}
            required={true}
            readOnly={true}
            icon={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs</Typography>}
          /> 
        </Grid>
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
            >Registrar Venta
          </Button>
        </form>
      </Box>
    </div>
  );
};
