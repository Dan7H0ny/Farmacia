import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import { Button, Grid, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {Person, Badge, Email, Numbers, PhoneAndroid, ExtensionSharp } from '@mui/icons-material';
import CustomTypography from '../components/CustomTypography';
import '../assets/css/menu.css';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectCom from '../components/CustomSelectCom';
import CustomSwal from '../components/CustomSwal';

export const RegistrarCliente = ( ) => {

  const [ nombreCompleto, setNombreCompleto ] = useState('');
  const [ correo, setCorreo ] = useState('');
  const [ telefono, setTelefono ] = useState('');
  const [ numberIdentity, setNumberIdentity ] = useState('');
  const [ plus, setPlus ] = useState('');
  const [ extension, setExtension ] = useState('');
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

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  useEffect(() => {
    const nombre = 'Identificación'
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
 
  const btnRegistrarCliente = (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es inválido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
      return;
    }
    if(telefono){
      if(telefono.length !== 8 || telefono < 60000000 || telefono > 79999999){
        setEnvioIntentado(true);
      }
      else {
        setEnvioIntentado(false);
        const combinedIdentity = plus ? `${numberIdentity}-${plus}` : `${numberIdentity}`;
        const nuevoCliente = {
          nombreCompleto,
          correo,
          telefono,
          numberIdentity,
          plus,
          extension,
          combinedIdentity,
          stringIdentity,
          usuario_: usuario_,
        };
        
        axios.post(`${UrlReact}/cliente/crear`, nuevoCliente, configInicial)
          .then(response => {
            CustomSwal({ icono: 'success', titulo: 'Cliente Creado', mensaje: response.mensaje });
            limpiarFormulario();
          })
          .catch(error => {
            console.log(error);
            CustomSwal({ icono: 'error', titulo: 'Error al crear el cliente', mensaje: error.response.mensaje });
          });
      }
    }
    else{
      const combinedIdentity = plus ? `${numberIdentity}-${plus}` : `${numberIdentity}`;
      const nuevoCliente = {
        nombreCompleto,
        correo,
        telefono,
        numberIdentity,
        plus,
        extension,
        combinedIdentity,
        stringIdentity,
        usuario_: usuario_,
      };
      
      axios.post(`${UrlReact}/cliente/crear`, nuevoCliente, configInicial)
        .then(response => {
          CustomSwal({ icono: 'success', titulo: 'Cliente Creado', mensaje: response.mensaje });
          limpiarFormulario();
        })
        .catch(error => {
          console.log(error);
          CustomSwal({ icono: 'error', titulo: 'Error al crear el cliente', mensaje: error.response.mensaje });
        });
    }
  };
  

  const limpiarFormulario = () => {
    setNombreCompleto("");
    setCorreo("");
    setTelefono("");
    setNumberIdentity("");
    setPlus("");
    setExtension("");
    setStringIdentity("");
    setEnvioIntentado(false);
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
              placeholder= 'Ingrese el correo del Cliente'
              type= 'email'
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required={false}
              icon={<Email/>}
            />
            <CustomRegisterUser
              number={6}
              label="Telefono"  
              placeholder= 'Ingrese el número del Cliente'
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
              number={4}
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
              placeholder= '0000'
              type= 'Number'
              value={plus}
              onChange={(e) => { 
                const inputValue = e.target.value;
                if ( inputValue.length > 4) {
                  setPlus(inputValue.slice(0, 4));
                } 
                else { 
                  setPlus(inputValue);
                }
              }}
              required={false}
              icon={<Numbers/>}
            />
            <CustomRegisterUser
              number={2}
              label="Extension"  
              placeholder= 'Extension'
              type= 'text'
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              required={false}
              icon={<ExtensionSharp/>}
            />
            <CustomSelectCom
              number={4}
              id="select-proveedor"
              label="Seleccione el proveedor"
              value={stringIdentity}
              onChange={(e) => setStringIdentity(e.target.value)}
              roles={complementos}
              icon={<Badge />}
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
