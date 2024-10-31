import React, {useEffect, useState, useMemo} from 'react';
import axios from 'axios';
import CustomTypography from './CustomTypography';
import CustomSwal from './CustomSwal';
import { useNavigate } from 'react-router-dom';
import InfoCard from './dashboard/InfoCard';
import InfoBarChar from './dashboard/InfoBarChar';
import InfoDonutChart from './dashboard/InfoDonutChart';
import InfoExtraerDatos from './dashboard/InfoExtraerDatos';
import InfoMeses from './dashboard/InfoMeses';
import InfoTable from './dashboard/InfoTable';
import { Grid, Typography} from '@mui/material';
import {Person2TwoTone, ExtensionSharp, ProductionQuantityLimits } from '@mui/icons-material';
import InfoComparacionBar from './dashboard/InfoComparacionBar';
import InfoComparacion from './dashboard/InfoComparacion';

const Dashboard = () => {
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [predicciones, setPredicciones] = useState([]);
  const [comparacion, setComparacion] = useState([]);
  const [tableDatos, setTableDatos] = useState([]);
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate();
  const usuario_ = localStorage.getItem('id');

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` }}), [token]);

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
    axios.post(`${UrlReact}/prediccion/mostrar/predicciones`, configInicial)
      .then(response => {
        const prediccionesFiltradas = response.filter(prediccion => prediccion.diaAgotamiento >= 1 && prediccion.diaAgotamiento <= 7).sort((a, b) => a.diaAgotamiento - b.diaAgotamiento).slice(0, 5);
        setPredicciones(prediccionesFiltradas);
        setTableDatos(response);
      })
      .catch(error => {
        console.log(error)
        CustomSwal({ icono: 'error', titulo: 'Error al obtener los productos', mensaje: error.mensaje ? error.response.data.mensaje : 'Error desconocido',});
      });
  }, [UrlReact, configInicial]);

  useEffect(() => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    }
    axios.get(`${UrlReact}/cliente/mostrar`, configInicial)
      .then(response => {
        setClientes(response.length);
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener los productos', mensaje: error.mensaje ? error.response.data.mensaje : 'Error desconocido',});
        navigate('/Menu/Administrador')
      });
  }, [navigate, token, configInicial, UrlReact]);

  useEffect(() => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    }
    axios.get(`${UrlReact}/proveedor/mostrar`, configInicial)
      .then(response => {
        setProveedores(response.length);
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener los productos', mensaje: error.mensaje ? error.response.data.mensaje : 'Error desconocido',});
        navigate('/Menu/Administrador')
      });
  }, [navigate, token, configInicial, UrlReact]);

  useEffect(() => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    }
    axios.get(`${UrlReact}/almacen/mostrar`, configInicial)
      .then(response => {
        setProductos(response.length);
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener los productos', mensaje: error.mensaje ? error.response.data.mensaje : 'Error desconocido',});
        navigate('/Menu/Administrador')
      });
  }, [navigate, token, configInicial, UrlReact]);
  return (
    <div id="caja_contenido" >
      <CustomTypography text={'PANEL DE CONTROL'} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5} >  
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} >
              <InfoCard title="CLIENTES REGISTRADOS" value={clientes} icon={<Person2TwoTone/>} color={'#15b79f'} />
            </Grid>
            <Grid item xs={12} sm={12} >
              <InfoCard title="PROVEEDORES REGISTRADOS" value={proveedores} icon={<ExtensionSharp/>} color={'#fb9c0c'} />
            </Grid>
            <Grid item xs={12} sm={12} >
              <InfoCard title="PRODUCTOS ALMACENADOS" value={productos} icon={<ProductionQuantityLimits/>} color={'#635bff'} />
            </Grid>
            <Grid item xs={12} sm={12}> 
              <InfoDonutChart/>
            </Grid>
            <Grid item xs={12} sm={12}> 
              <InfoMeses/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={7}>
          <Grid container spacing={2}>  
            {predicciones && (
              <Grid item xs={12} sm={12}>
                <InfoBarChar predicciones={predicciones} titulo={<Typography variant="h6" component="div">5 PRODUCTOS PREVISTOS PARA VENDER EN LOS SIGUIENTES DÍAS</Typography>}/>
                <InfoExtraerDatos setPredicciones={setPredicciones} />
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <InfoComparacion tableDatos={tableDatos} setComparacion={setComparacion}/>
              <InfoComparacionBar comparacion={comparacion}/>
            </Grid>
          </Grid>
        </Grid>
        {tableDatos && (
          <Grid item xs={12} sm={12}>
            <InfoTable predicciones={tableDatos} usuario={usuario}/>
          </Grid>
        )} 
      </Grid>
    </div>
  );
};
export default Dashboard;