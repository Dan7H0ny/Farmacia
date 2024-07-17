import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Button, Grid, Box } from '@mui/material';
import '../assets/css/menu.css';
import { useNavigate } from 'react-router-dom';
import {AddBusiness, Filter9Plus, DateRange, AttachMoney, Search, ProductionQuantityLimits} from '@mui/icons-material';
import CustomSwal from '../components/CustomSwal';
import CustomTypography from '../components/CustomTypography';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectCom from '../components/CustomSelectCom';
import CustomForm from '../components/CustomForm';
import CustomSubtitulo from '../components/CustomSubtitulo';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

export const RegistrarAlmacen = () => {
  const [producto, setProducto] = useState([]);
  const [idproducto, setIdProducto] = useState('');
  const [datos, setDatos] = useState('');
  const [complementos, setComplementos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [cantidad_stock, setCantidad_stock] = useState('');
  const [fecha_caducidad, setFechaCaducidad] = useState(''); 
  const usuario_ = localStorage.getItem('id');
  const [buscar, setBuscar] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    const nombre = 'Categoría'
    axios.get(`${UrlReact}/complemento/buscarNombre/${nombre}`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setComplementos(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  useEffect(() => {
    axios.get(`${UrlReact}/producto/mostrar`, configInicial )
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setProducto(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  const btnRegistrarAlmacen= (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    } 
    else 
    {
      const mialmacen = { producto:idproducto, categoria, precioVenta, cantidad_stock, fecha_caducidad, usuario: usuario_};
      axios.post(`${UrlReact}/almacen/crear`, mialmacen, configInicial)
        .then(response => {
          CustomSwal({ icono: 'success', titulo: 'Almacen Creado', mensaje: response.mensaje});
          limpiarFormulario();
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'Error al crear el Almacen', mensaje: error.mensaje});
        });
    }
  }

  const btnAñadir = (producto) => {
    setDatos(producto)
    setIdProducto(producto._id)
  }

  const limpiarFormulario = () => {
    setDatos("");
    setCategoria("");
    setPrecioVenta("");
    setCantidad_stock("");
    setFechaCaducidad("");
  }
  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registro de almacen'} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} sx={{marginTop: 'auto',}}>
            <CustomSubtitulo text={'Elige el producto'} />
            <form id="Form-2" className="custom-form">
              <CustomRegisterUser
                number={12}
                label="Nombre"  
                placeholder= 'Buscar el nombre del producto'
                type= 'text'
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                required={true}
                icon={<Search/>}
              />
              <CustomForm productos={producto} buscar={buscar} btnAñadir={btnAñadir}/>
            </form>
          </Grid>
          <Grid item xs={12} sm={6} sx={{marginTop: 'auto',}}>
            <form id="Form-1" onSubmit={btnRegistrarAlmacen} className="custom-form">
              <Grid container spacing={2}>
                <CustomRegisterUser
                  number={12}
                  label="Producto" 
                  placeholder= 'Seleccione el producto de la izquierda'
                  type= 'text'
                  rows={5.5}
                  multiline= {true} 
                  value={datos?
                    `Producto:\t\t${datos.nombre}\nProveedor:\t\t${datos.proveedor.nombre_marca}\nTipo:\t\t\t${datos.tipo.nombre}\nCapacidad:\t\t${datos.capacidad_presentacion}\nPrecio de compra:\t${datos.precioCompra}` 
                    : ''}
                  onChange={(e) => setDatos(e.target.value)}
                  required={true}
                  readOnly={true}
                  icon={<ProductionQuantityLimits/>}
                />
                <CustomSelectCom
                  number={12}
                  id="categoria"
                  label="Seleccione la categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  roles={complementos}
                  icon={<AddBusiness />}
                />
                <CustomRegisterUser
                  number={12}
                  label="Fecha Caducidad" 
                  placeholder= 'Ingrese la fecha de caducidad'
                  type= 'date'
                  value={fecha_caducidad}
                  onChange={(e) => setFechaCaducidad(e.target.value)}
                  required={true}
                  icon={<DateRange/>}
                />
                <CustomRegisterUser
                  number={6}
                  label="Precio" 
                  placeholder= {datos.precioCompra}
                  type= 'Number'
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value)}
                  required={true}
                  icon={<AttachMoney/>}
                />
                <CustomRegisterUser
                  number={6}
                  label="Stock" 
                  placeholder= 'Ingrese la cantidad de stock que tiene este prodcuto'
                  type= 'Number'
                  value={cantidad_stock}
                  onChange={(e) => setCantidad_stock(e.target.value)}
                  required={true}
                  icon={<Filter9Plus/>}
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
                >Añadir producto al almacen
                </Button>
              </form>
            </Grid>
        </Grid>
      </Box>
    </div>
  )
}
