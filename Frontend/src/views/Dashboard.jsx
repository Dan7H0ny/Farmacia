import React, {useEffect, useState, useMemo} from 'react';
import axios from 'axios';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../components/InfoCard';
import BarChartInfo from '../components/BarChartInfo';
import InfoDonutChart from '../components/InfoDonutChart';
import { Grid } from '@mui/material';
import {Person2TwoTone, ExtensionSharp, ProductionQuantityLimits } from '@mui/icons-material';

export const Dashboard = () => {
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  
  const navigate = useNavigate();

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);
  
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
      <CustomTypography text={'Dashboard'} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} >  
          <InfoCard title="CLIENTES" value={clientes} icon={<Person2TwoTone/>} color={'#15b79f'} />
        </Grid>
        <Grid item xs={12} sm={4} >  
          <InfoCard title="PROVEEDORES" value={proveedores} icon={<ExtensionSharp/>} color={'#fb9c0c'} />
        </Grid>
        <Grid item xs={12} sm={4} >  
          <InfoCard title="ALMACEN" value={productos} icon={<ProductionQuantityLimits/>} color={'#635bff'} />
        </Grid>
        <Grid item xs={12} sm={7} >  
          <BarChartInfo />
        </Grid>
        <Grid item xs={12} sm={5} >  
          <InfoDonutChart/>
        </Grid>
      </Grid>
    </div>
  );
};
