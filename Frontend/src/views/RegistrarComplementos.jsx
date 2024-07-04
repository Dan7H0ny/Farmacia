import React, { useState } from 'react';
import axios from 'axios';
import { Button, Grid, Box } from '@mui/material';
import { DevicesOther, Apps, SettingsInputComponent } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomSelect from '../components/CustomSelect';
import '../assets/css/menu.css';
import CustomRegisterUser from '../components/CustomRegisterUser';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

export const RegistrarComplementos = () => {
  const [nombreComplemento, setnombreComplemento] = useState('');
  const [nombre, setNombre] = useState('');
  const [limiteComplemento, setlimiteComplemento] = useState('');
  const navigate = useNavigate();

  const complementos = [
    { nombre: 'identificaciones' },
  ];
  
  const btnRegistrarComplemento = (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    }
    else{
      const NuevoComplemento = { nombreComplemento, nombre, limiteComplemento };
      axios.post(`${UrlReact}/complemento/crear`, NuevoComplemento, configInicial)
        .then(response => {
          CustomSwal({ icono: 'success', titulo: 'Usuario Creado', mensaje: response.mensaje});
          limpiarFormulario();
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'Error al crear el usuario', mensaje: error.mensaje});
        });
      return;
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setlimiteComplemento("");
  };

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registro de Complementos'} />
        <form id="Form-1" onSubmit={btnRegistrarComplemento} className="custom-form">
          <Grid container spacing={3}>
            <CustomSelect
              number ={4}
              id="select-rol"
              label="Seleccione un tipo de complemento"
              value={nombreComplemento}
              onChange={(e) => setnombreComplemento(e.target.value)}
              roles={complementos}
              icon={<DevicesOther/>}
            />
            <CustomRegisterUser
              number={4}
              label="Complemento" 
              placeholder= 'Ingrese el nombre del complemento'
              type= 'text'
              value={nombre}
              onChange={(e) => { 
                const inputValue = e.target.value; 
                const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                setNombre(newValue);
              }}
              required={true}
              icon={<SettingsInputComponent/>}
            />
            <CustomRegisterUser
              number={4}
              label="Limitaciones" 
              placeholder= 'Ingrese un limite'
              type= 'Number'
              value={limiteComplemento}
              onChange={(e) => setlimiteComplemento(e.target.value)}
              required={false}
              icon={<Apps/>}
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
          >Guardar Complemento
          </Button>
        </form>
      </Box>
    </div>
  );
};
