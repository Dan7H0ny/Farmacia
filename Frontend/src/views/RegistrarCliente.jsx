import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Button, Grid, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {Person, Badge, Email, Numbers, PhoneAndroid } from '@mui/icons-material';
import CustomTypography from '../components/CustomTypography.jsx';
import '../assets/css/menu.css';
import CustomRegisterUser from '../components/CustomRegisterUser.jsx';
import CustomSelect from '../components/CustomSelect.jsx';
import CustomSwal from '../components/CustomSwal.jsx';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

export const RegistrarCliente = ( ) => {

  const [ nombreCompleto, setNombreCompleto ] = useState('');
  const [ correo, setCorreo ] = useState('');
  const [ telefono, setTelefono ] = useState('');
  const [ numberIdentity, setNumberIdentity ] = useState('');
  const [ plus, setPlus ] = useState('');
  const [ stringIdentity, setStringIdentity ] = useState('');
  const [ complementos, setComplementos ] = useState([]);
  const [ envioIntentado, setEnvioIntentado ] = useState(false);
  const usuario_ = localStorage.getItem('id');
  const navigate = useNavigate();

  const mostrarMensajeValidacion = (mensaje) => {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        <div dangerouslySetInnerHTML={{ __html: mensaje }} />
      </Alert>
    );
  };

  useEffect(() => {
    const nombre = 'identificaciones'
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
 
  const btnRegistrarCliente = (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    }
    else
    {
      if(telefono){
        if(telefono.length !== 12 || numberIdentity.length < 7 || numberIdentity.length > 12){
          setEnvioIntentado(true);
        }
        else {
          setEnvioIntentado(false);
          const NuevoCliente = { nombreCompleto, correo, telefono, numberIdentity: numberIdentity + plus, stringIdentity, usuario_: usuario_ };
          axios.post(`${UrlReact}/cliente/crear`, NuevoCliente, configInicial)
            .then(response => {
              CustomSwal({ icono: 'success', titulo: 'Cliente Creado', mensaje: response.mensaje});
              limpiarFormulario();
            })
            .catch(error => {
              console.log(error)
              CustomSwal({ icono: 'error', titulo: 'Error al crear el cliente', mensaje: error.mensaje});
            });
        }
      }
      else{
        const NuevoCliente = { nombreCompleto, correo, telefono, numberIdentity: numberIdentity + plus, stringIdentity, usuario_: usuario_ };
          axios.post(`${UrlReact}/cliente/crear`, NuevoCliente, configInicial)
            .then(response => {
              CustomSwal({ icono: 'success', titulo: 'Cliente Creado', mensaje: response.mensaje});
              limpiarFormulario();
            })
            .catch(error => {
              console.log(error)
              CustomSwal({ icono: 'error', titulo: 'Error al crear el cliente', mensaje: error.mensaje});
            });
      }        
    }
  }

  const limpiarFormulario = () => {
    setNombreCompleto("");
    setCorreo("");
    setTelefono("");
    setNumberIdentity("");
    setStringIdentity("");
    document.getElementById("Form-1").reset();
  }

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registro de Clientes'} />
        <form id="Form-1" onSubmit={btnRegistrarCliente} className="custom-form">
          <Grid container spacing={3} >
            <CustomRegisterUser
              number={12}
              label="Nombre Completo" 
              placeholder= 'Ingrese el nombre completo del cliente'
              type= 'text'
              value={nombreCompleto}
              onChange={(e) => { 
                const inputValue = e.target.value; 
                const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                setNombreCompleto(newValue);
              }}
              required={true}
              icon={<Person/>}
            />
            <CustomRegisterUser
              number={6}
              label="Correo"  
              placeholder= 'Ingrese el correo del Usuario'
              type= 'email'
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required={false}
              icon={<Email/>}
            />
            <CustomRegisterUser
              number={6}
              label="Telefono"  
              placeholder= 'Ingrese el número del Usuario'
              type= 'Number'
              value={telefono}
              onChange={(e) => { 
                const inputValue = e.target.value;
                if ( inputValue.length > 8) {
                  setTelefono(inputValue.slice(0, 8));
                } 
                else { 
                  setTelefono(inputValue);
                }
              }}
              required={false}
              icon={<PhoneAndroid/>}
            />
            <CustomRegisterUser
              number={6}
              label="Identidad"  
              placeholder= 'Ingrese su numero de indentidad'
              type= 'Number'
              value={numberIdentity}
              onChange={(e) => { 
                const inputValue = e.target.value;
                if ( inputValue.length > 12) {
                  setNumberIdentity(inputValue.slice(0, 12));
                } 
                else { 
                  setNumberIdentity(inputValue);
                }
              }}
              required={true}
              icon={<Numbers/>}
            />
            <CustomRegisterUser
              number={2}
              label="Plus"  
              placeholder= '000000'
              type= 'Number'
              value={plus}
              onChange={(e) => { 
                const inputValue = e.target.value;
                if ( inputValue.length > 8) {
                  setPlus(inputValue.slice(0, 15));
                } 
                else { 
                  setPlus(inputValue);
                }
              }}
              required={false}
              icon={<Numbers/>}
            />
            <CustomSelect
              number ={4}
              id="select-stringIdentity"
              label="Seleccione la identificaciones del cliente"
              value={stringIdentity}
              onChange={(e) => setStringIdentity(e.target.value)}
              roles={complementos}
              icon={<Badge/>}
            />
          </Grid>
          {envioIntentado && mostrarMensajeValidacion("<div>Por favor ingrese un número de teléfono válido </div>")}
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
          >Guardar Usuario
          </Button>
        </form>
      </Box>
    </div>
  );
};
