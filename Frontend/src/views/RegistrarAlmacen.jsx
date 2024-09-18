import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import { Button, Grid, Box, Typography } from '@mui/material';
import '../assets/css/menu.css';
import { useNavigate } from 'react-router-dom';
import {AddBusiness, Filter9Plus, DateRange} from '@mui/icons-material';
import CustomSwal from '../components/CustomSwal';
import CustomTypography from '../components/CustomTypography';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectCom from '../components/CustomSelectCom';
import CustomForm from '../components/CustomForm';
import CustomSubtitulo from '../components/CustomSubtitulo';

export const RegistrarAlmacen = () => {
  const [producto, setProducto] = useState([]);
  const [complementos, setComplementos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [cantidad_stock, setCantidad_stock] = useState('');
  const [fecha_caducidad, setFechaCaducidad] = useState(''); 
  const usuario_ = localStorage.getItem('id');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

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
  }, [navigate, token, configInicial, UrlReact]);

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
  }, [navigate, token, configInicial, UrlReact]);

  const btnRegistrarAlmacen= (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    } 
    else 
    {
      if(selectedProduct){
        const mialmacen = { producto:selectedProduct._id, categoria, precioVenta, cantidad_stock: cantidad_stock*selectedProduct.capacidad_presentacion, fecha_caducidad, usuario: usuario_};
          axios.post(`${UrlReact}/almacen/crear`, mialmacen, configInicial)
          .then(response => {
            CustomSwal({ icono: 'success', titulo: 'Almacen Creado', mensaje: response.mensaje});
            limpiarFormulario();
          })
          .catch(error => {
            CustomSwal({ icono: 'error', titulo: 'Error al crear el Almacen', mensaje: error.mensaje});
          });
      }
      else{
        CustomSwal({ icono: 'error', titulo: 'No existe el producto', mensaje: "Por favor seleccione un producto"});
      }
    }
  }

  const limpiarFormulario = () => {
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
          <Grid item xs={12} sm={12} sx={{marginTop: 'auto',}}>
            <form id="Form-1" onSubmit={btnRegistrarAlmacen} className="custom-form">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                <CustomSubtitulo text={'Elige el producto'}/>
                </Grid>
                <CustomForm productos={producto} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
                <CustomSelectCom
                  number={7}
                  id="categoria"
                  label="Seleccione la categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  roles={complementos}
                  icon={<AddBusiness />}
                />
                <CustomRegisterUser
                  number={5}
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
                  placeholder= "Ingrese el precio de Venta"
                  type= 'Number'
                  value={precioVenta}
                  onChange={(e) => {if (/^\d*\.?\d{0,2}$/.test(e.target.value)) {setPrecioVenta(e.target.value);}}}
                  required={true}
                  icon={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bs</Typography>}
                  onKeyPress={(e) => { if (!/[\d.]$/.test(e.key) || (e.key === '.' && precioVenta.includes('.'))) {e.preventDefault();}}}
                />
                <CustomRegisterUser
                  number={6}
                  label={selectedProduct ? selectedProduct.tipo.nombre : 'STOCK'}
                  placeholder= 'Ingrese la cantidad de stock que tiene este prodcuto'
                  type= 'Number'
                  value={cantidad_stock}
                  onChange={(e) => setCantidad_stock(e.target.value)}
                  required={true}
                  icon={<Filter9Plus/>}
                  onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}
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
