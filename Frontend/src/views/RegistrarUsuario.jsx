import React, {useState} from 'react';
import { Button, Box , Grid, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Password, Email, PhoneAndroid, Person, SupervisedUserCircle, Room, People } from '@mui/icons-material';
import CustomTypography from '../components/CustomTypography';
import '../assets/css/menu.css';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelect from '../components/CustomSelect';
import CustomSwal from '../components/CustomSwal.jsx';

export const RegistrarUsuario = () => {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rol, setRol] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [envioIntentado, setEnvioIntentado] = useState(false);
  const navigate = useNavigate();

  const obtenerToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  const mostrarMensajeValidacion = (mensaje) => {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        <div dangerouslySetInnerHTML={{ __html: mensaje }} />
      </Alert>
    );
  };

  const token = obtenerToken();
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const config = {headers: {Authorization: `Bearer ${token}`}}; 

  const roles = [
    { nombre: 'Administrador' },
    { nombre: 'Cajero' },
  ];

  const btnRegistrarUsuario = (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    }
    else{
      if(telefono){
        if(telefono.length !== 8 || telefono < 60000000 || telefono > 79999999){
          setEnvioIntentado(true);
        }
        else {
          setEnvioIntentado(false);
          const NuevoUsuario = { nombre, apellido, rol, direccion, telefono, correo, password };
          axios.post(`${UrlReact}/usuario/crear`, NuevoUsuario, config)
            .then(response => {
              CustomSwal({ icono: 'success', titulo: 'Usuario Creado', mensaje: response.mensaje});
              limpiarFormulario();
            })
            .catch(error => {
              CustomSwal({ icono: 'error', titulo: 'Error al crear el usuario', mensaje: error.mensaje});
            });
        }
        return;
      }
      else{
        const NuevoUsuario = { nombre, apellido, rol, direccion, telefono, correo, password };
        axios.post(`${UrlReact}/usuario/crear`, NuevoUsuario, config)
          .then(response => {
            CustomSwal({ icono: 'success', titulo: 'Usuario Creado', mensaje: response.mensaje});
            limpiarFormulario();
          })
          .catch(error => {
            CustomSwal({ icono: 'error', titulo: 'Error al crear el usuario', mensaje: error.mensaje});
          });
          return;
      }    
    }
  };
  
  const limpiarFormulario = () => {
    setNombre("");
    setApellido("");
    setRol("");
    setDireccion("");
    setTelefono("");
    setCorreo("");
    setPassword("");
    document.getElementById("Form-1").reset();
  }
  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registro de Usuarios'} />
        <form id="Form-1" onSubmit={btnRegistrarUsuario} className="custom-form">
          <Grid container spacing={3} >
            <CustomRegisterUser
              number={6}
              label="Nombre/s" 
              placeholder= 'Ingrese el nombre del usuario'
              type= 'text'
              value={nombre}
              onChange={(e) => { 
                const inputValue = e.target.value; 
                const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                setNombre(newValue);
              }}
              required={true}
              icon={<Person/>}
            />
            <CustomRegisterUser
              number={6}
              label="Apellido/s"  
              placeholder= 'Ingrese el apellido del usuario'
              type= 'text'
              value={apellido}
              onChange={(e) => { 
                const inputValue = e.target.value; 
                const newValue = inputValue.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
                setApellido(newValue);
              }}
              required={true}
              icon={<SupervisedUserCircle/>}
            />
            <CustomRegisterUser
              number={12}
              label="Direccion"  
              placeholder= 'Ingrese la direccion del Usuario'
              type= 'text'
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required={false}
              icon={<Room/>}
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
            <CustomSelect
              number ={6}
              id="select-rol"
              label="Seleccione un rol para el usuario"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              roles={roles}
              icon={<People/>}
            />
            <CustomRegisterUser
              number={6}
              label="Correo"  
              placeholder= 'Ingrese el correo del Usuario'
              type= 'email'
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required={true}
              icon={<Email/>}
            />
            <CustomRegisterUser
              number={6}
              label="Password"  
              placeholder= 'Ingrese el password del Usuario'
              type= 'password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
              icon={<Password/>}
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



