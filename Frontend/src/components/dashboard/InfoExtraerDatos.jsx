import React, { useState, useMemo } from 'react';
import { Grid, Button } from '@mui/material';
import { ProductionQuantityLimits, AllInbox } from '@mui/icons-material';
import CustomRegisterUser from '../CustomRegisterUser';
import CustomSwal from '../CustomSwal';
import axios from 'axios';

const InfoExtraerDatos = ({setPredicciones}) => {
  const [producto, setProducto] = useState(''); 
  const [categoria, setCategoria] = useState('');
  
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` }}), [token]);

  const btnObtenerProducto = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${UrlReact}/prediccion/mostrar/nombre`, { nombreProducto: producto }, configInicial);
      setPredicciones(response); 
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'Error al obtener las predicciones', mensaje: error.response?.data?.error || error.message });
    }
  };

  const btnObtenerCategoria = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${UrlReact}/prediccion/mostrar/categoria`, { nombreCategoria: categoria }, configInicial);
      setPredicciones(response); 
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'Error al obtener las predicciones', mensaje: error.response?.data?.error || error.message });
    }
  };

  return (
    <>
      <form id="Form-1" onSubmit={btnObtenerProducto} className="custom-form" sx={{margin:'auto'}}>
        <Grid container spacing={2}>
          <CustomRegisterUser
            number={8}
            label="BUSCAR POR PRODUCTO" 
            placeholder='Ingrese el nombre del producto'
            type='text'
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            required={true}
            icon={<ProductionQuantityLimits />}
          />
          <Grid item xs={12} sm={4} sx={{padding: 'auto'}}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                border: '2px solid #0f1b35',
                marginTop: 2.5,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                  border: '2px solid #0f1b35',
                },
              }}
            >
              BUSCAR
            </Button>
          </Grid>
        </Grid>
      </form>
      <form id="Form-2" onSubmit={btnObtenerCategoria} className="custom-form2">
        <Grid container spacing={2}>
          <CustomRegisterUser
            number={8}
            label="BUSCAR POR CATEGORIA" 
            placeholder= 'Ingrese la categoria de un producto'
            type= 'type'
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required={true}
            icon={<AllInbox/>}
          />
          <Grid item xs={12} sm={4} sx={{padding: 'auto'}}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                border: '2px solid #0f1b35',
                marginTop: 2.5,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                  border: '2px solid #0f1b35',
                },
              }}
            >
              BUSCAR
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default InfoExtraerDatos;
