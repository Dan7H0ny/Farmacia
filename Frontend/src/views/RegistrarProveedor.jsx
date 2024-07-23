import React, { useState } from 'react'
import axios from 'axios';
import { Button ,Alert, Grid, Box } from '@mui/material';
import '../assets/css/menu.css';
import { useNavigate } from 'react-router-dom';
import {AddBusiness, Email, LocalPhone, Language, SupervisedUserCircle, PhoneAndroid} from '@mui/icons-material';
import CustomSwal from '../components/CustomSwal.jsx';
import CustomTypography from '../components/CustomTypography.jsx';
import CustomRegisterUser from '../components/CustomRegisterUser.jsx';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

export const RegistrarProveedor = () => {
  const [nombre_marca, setNombreMarca] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sitioweb, setSitioWeb] = useState('');
  const [nombre_vendedor, setNombreVendedor] = useState('');
  const [correo_vendedor, setCorreoVendedor] = useState('');
  const [celular, setCelular] = useState('');
  const [ envioIntentado, setEnvioIntentado ] =useState(false);

  const navigate = useNavigate();

  const mostrarMensajeValidacion = (mensaje) => {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        <div dangerouslySetInnerHTML={{ __html: mensaje }} />
      </Alert>
    );
  };

  const btnRegistrarProveedor = (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    } 
    else 
    {
      if(telefono){
        if(telefono.length !== 8 || telefono < 60000000 || telefono > 79999999){
          setEnvioIntentado(true);
        }
        else {
          setEnvioIntentado(false);
          const miProveedor = { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular};
          axios.post(`${UrlReact}/proveedor/crear`, miProveedor, configInicial)
            .then(response => {
              CustomSwal({ icono: 'success', titulo: 'Proveedor Creado', mensaje: response.mensaje});
              limpiarFormulario();
            })
            .catch(error => {
              CustomSwal({ icono: 'error', titulo: 'Error al crear el Proveedor', mensaje: error.mensaje});
            });
        }
        return;
      }
      else{
        const miProveedor = { nombre_marca, correo, telefono, sitioweb, nombre_vendedor, correo_vendedor, celular};
        axios.post(`${UrlReact}/proveedor/crear`, miProveedor, configInicial)
          .then(response => {
            CustomSwal({ icono: 'success', titulo: 'Proveedor Creado', mensaje: response.mensaje});
            limpiarFormulario();
          })
          .catch(error => {
            CustomSwal({ icono: 'error', titulo: 'Error al crear el Proveedor', mensaje: error.mensaje});
          });
          return;
      }
    }
  }

  const limpiarFormulario = () => {
    setNombreMarca("");
    setCorreo("");
    setTelefono("");
    setSitioWeb("");
    setNombreVendedor("");
    setCorreoVendedor("");
    setCelular("");
    setEnvioIntentado(false)
    document.getElementById("Form-1").reset();
  }
  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registro de Proveedores'} />
        <form id="Form-1" onSubmit={btnRegistrarProveedor} className="custom-form">
          <Grid container spacing={3}>
            <CustomRegisterUser
              number={12}
              label="Marca" 
              placeholder= 'Ingrese el nombre de la marca del proveedor'
              type= 'text'
              value={nombre_marca}
              onChange={(e) => { 
                const inputValue = e.target.value; 
                const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                setNombreMarca(newValue);
              }}
              required={true}
              icon={<AddBusiness/>}
            />
            <CustomRegisterUser
              number={4}
              label="Correo" 
              placeholder= 'Ingrese el correo de la marca del proveedor'
              type= 'email'
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required={false}
              icon={<Email/>}
            />
            <CustomRegisterUser
              number={4}
              label="Telefono" 
              placeholder= 'Ingrese el telefono del proveedor'
              type= 'number'
              value={telefono}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length > 8) {
                  setTelefono(inputValue.slice(0, 8));
                } else {
                  setTelefono(inputValue);
                }
              }}
              required={false}
              icon={<LocalPhone/>}
            />
            <CustomRegisterUser
              number={4}
              label="Sitio Web" 
              placeholder= 'Ingrese el sitio web del proveedor'
              type= 'text'
              value={sitioweb}
              onChange={(e) => setSitioWeb(e.target.value)}
              required={false}
              icon={<Language/>}
            />
            <CustomRegisterUser
              number={12}
              label="Nombre del Vendedor" 
              placeholder= 'Ingrese el nombre del vendedor del proveedor'
              type= 'text'
              value={nombre_vendedor}
              onChange={(e) => setNombreVendedor(e.target.value)}
              required={true}
              icon={<SupervisedUserCircle/>}
            />
            <CustomRegisterUser
              number={6}
              label="Correo del Vendedor" 
              placeholder= 'Ingrese el correo del vendedor del proveedor'
              type= 'text'
              value={correo_vendedor}
              onChange={(e) => setCorreoVendedor(e.target.value)}
              required={false}
              icon={<Email/>}
            />
            <CustomRegisterUser
              number={6}
              label="Celular del Vendedor" 
              placeholder= 'Ingrese el correo del vendedor del proveedor'
              type= 'number'
              value={celular}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length > 8) {
                  setCelular(inputValue.slice(0, 8));
                } else {
                  setCelular(inputValue);
                }
              }}
              required={false}
              icon={<PhoneAndroid/>}
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
          >Guardar Proveedor
          </Button>
        </form>
      </Box>
    </div>
  )
}
