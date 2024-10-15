import React, { useState, useMemo } from 'react';
import { Grid, Button } from '@mui/material';
import { DateRange } from '@mui/icons-material';
import CustomRegisterUser from '../CustomRegisterUser';
import CustomSwal from '../CustomSwal';
import axios from 'axios';
import CustomAutocompleteNuevo from '../CustomAutocompleteNuevo';

const InfoComparacion = ({tableDatos, setComparacion}) => {
  const [fechaNueva, setFechaNueva] = useState('');
  const [idPrediccion, setIdPrediccion] = useState(null);
  const [inputPrediccion, setInputPrediccion] = useState('');  
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` }}), [token]);
  const btnObtenerComparacion = async (event) => {
    event.preventDefault();
    try {
      axios.post(`${UrlReact}/prediccion/comparar/predicciones`, { idProducto: idPrediccion.productos, fecha: fechaNueva,}, configInicial)
      .then(response => {
        setComparacion(response);
        console.log(response);
      })
      .catch(error => {
        CustomSwal({ icono: 'error', titulo: 'Error al obtener los productos', mensaje: error.mensaje });
      });
    } catch (error) {
      CustomSwal({ icono: 'error', titulo: 'Error al obtener las predicciones', mensaje: error.mensaje });
    }
  };
  
  return (
    <>
      <form id="Form-1" onSubmit={btnObtenerComparacion} className="custom-form" >
        <Grid container spacing={1}>
          <CustomAutocompleteNuevo predicciones={tableDatos} idPrediccion={idPrediccion} setIdPrediccion={setIdPrediccion} inputPrediccion={inputPrediccion} setInputPrediccion={setInputPrediccion}/>
          <CustomRegisterUser
            number={4}
            label="Fecha de registro"
            placeholder='Seleccione una fecha de prediccion'
            type='date'
            value={fechaNueva}
            onChange={(e) => setFechaNueva(e.target.value)}
            required={true}
            icon={<DateRange />}
            sx={{
              '& .MuiFormLabel-root': {
                fontSize: '0.75rem',  // Tamaño más pequeño de la etiqueta
              },
              '& .MuiInputBase-root': {
                fontSize: '0.75rem',  // Tamaño más pequeño del input
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.2rem',   // Reducir el tamaño del icono
              },
              '& .MuiFormControl-root': {
                marginBottom: '8px',  // Reducir el margen inferior
              },
              width: '100%',  // Ajustar el ancho del input para hacer el diseño más compacto
            }}
          />
          <Grid item xs={12} sm={4} sx={{margin: 'auto'}}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                border: '2px solid #0f1b35',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                },
              }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default InfoComparacion;
