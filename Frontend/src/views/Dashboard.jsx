import React, {useEffect, useState} from 'react';
import { Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { PersonPin, ManageAccounts, Inventory, AddShoppingCart } from '@mui/icons-material';
import CustomInfoDashboard from '../components/CustomInfoDashboard';
import WebsiteViews from '../components/Dashboard/WebsiteViews';
import DailySales from '../components/Dashboard/DailySales';
import CompletedTasks from '../components/Dashboard/CompletedTasks';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import { useNavigate } from 'react-router-dom';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const Dashboard = () => {
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

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
  }, [navigate]);

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
  }, [navigate]);

  useEffect(() => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    }
    axios.get(`${UrlReact}/producto/mostrar`, configInicial)
      .then(response => {
        setProductos(response.length);
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener los productos', mensaje: error.mensaje ? error.response.data.mensaje : 'Error desconocido',});
        navigate('/Menu/Administrador')
      });
  }, [navigate]);

  useEffect(() => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador');
    }
    axios.get(`${UrlReact}/venta/mostrar`, configInicial)
      .then(response => {
        setVentas(response.length);
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener los productos', mensaje: error.mensaje ? error.response.data.mensaje : 'Error desconocido',});
        navigate('/Menu/Administrador')
      });
  }, [navigate]);

  return (
    <div id="caja_contenido" >
      <CustomTypography text={'Dashboard'} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Item sx={{backgroundColor: '#e2e2e2', border: '2px solid #0f1b35', borderRadius: '15%',}}><CustomInfoDashboard icon={<PersonPin sx={{ width:'65%', height:'65%'}}/>} text={"Clientes"} number={clientes} porcentaje={"+5% el ultimo mes"}/></Item>
        </Grid>
        <Grid item xs={12} md={3}>
          <Item sx={{backgroundColor: '#e2e2e2', border: '2px solid #0f1b35', borderRadius: '15%',}}><CustomInfoDashboard icon={<ManageAccounts sx={{ width:'65%', height:'65%'}}/>} text={"Proveedores"} number={proveedores} porcentaje={"+5% el ultimo mes"}/></Item>
        </Grid>
        <Grid item xs={12} md={3}>
          <Item sx={{backgroundColor: '#e2e2e2', border: '2px solid #0f1b35', borderRadius: '15%',}}><CustomInfoDashboard icon={<Inventory sx={{ width:'65%', height:'65%'}}/>} text={"Productos"} number={productos} porcentaje={"+5% el ultimo mes"}/></Item>
        </Grid>
        <Grid item xs={12} md={3}>
          <Item sx={{backgroundColor: '#e2e2e2', border: '2px solid #0f1b35', borderRadius: '15%',}}><CustomInfoDashboard icon={<AddShoppingCart sx={{ width:'65%', height:'65%'}}/>} text={"Ventas"} number={ventas} porcentaje={"+5% el ultimo mes"}/></Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <WebsiteViews />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>
            <DailySales />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <CompletedTasks />
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};
