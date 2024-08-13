import React,{useMemo, useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { Autocomplete, TextField, Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {Person, Badge, Email, Numbers, PhoneAndroid, Extension } from '@mui/icons-material';
import CustomSelectC from '../components/CustomSelectC';
import { createRoot } from 'react-dom/client';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomSwal from '../components/CustomSwal';
import Swal from 'sweetalert2';

const CustomAutocompleteCliente = ({ clientes, setClientes, idcliente, setIdCliente,inputCliente,setInputCliente, usuario_ }) => {
  const [ complementos, setComplementos ] = useState([]);
  const identidadSelect = useRef();

  const navigate = useNavigate();
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

  const btnRegistrarCliente = () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(
      <Grid container spacing={2}>
        <CustomActualizarUser number={12} id="nombreCompleto" label="Nombre Completo" type="text" required={true} icon={<Person />} />
        <CustomActualizarUser number={6} id="correo" label="Correo" type="email" required={false} icon={<Email />} />
        <CustomActualizarUser number={6} id="telefono" label="Telefono" type="number" required={false} icon={<PhoneAndroid />} />
        <CustomActualizarUser number={6} id="numberIdentity" label="Numero de Identidad" type="number" icon={<Badge />} />
        <CustomActualizarUser number={3} id="plus" label="Plus" type="number" required={true} icon={<Numbers />} />
        <CustomActualizarUser number={3} id="extension" label="Extension" type="text" required={false} icon={<Extension />} />
        <CustomSelectC number={12} id="identidad-select" label="Seleccione la identidad del cliente" value={''} roles={complementos} ref={identidadSelect} icon={<Badge />}/>
      </Grid>
    );

    Swal.fire({
      title: 'REGISTRAR CLIENTE',
      html: container,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'customs-swal-popup',
        title: 'customs-swal-title',
        confirmButton: 'swal2-confirm custom-swal2-confirm',
        cancelButton: 'swal2-cancel custom-swal2-cancel',
      },
      didOpen: () => {
        setTimeout(() => {
          const nombreInput = document.getElementById('nombreCompleto');
          const telefonoInput = document.getElementById('telefono');
          const identidadInput = document.getElementById('numberIdentity');
          const plusInput = document.getElementById('plus');
          const extensionInput = document.getElementById('extension');

          if (nombreInput) {
            nombreInput.addEventListener('input', function () {
              this.value = this.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
            });
          }

          if (extensionInput) {
            extensionInput.addEventListener('input', function () {
              this.value = this.value.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÑ\s]/g, '');
            });
          }

          if (telefonoInput) {
            telefonoInput.addEventListener('input', function () {
              this.value = this.value.replace(/[^\d]/g, '');
              if (this.value.length > 8) {
                this.value = this.value.slice(0, 8);
              }
            });
          }

          if (plusInput) {
            plusInput.addEventListener('input', function () {
              this.value = this.value.replace(/[^\d]/g, '');
              if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
              }
            });
          }

          if (identidadInput) {
            identidadInput.addEventListener('input', function () {
              this.value = this.value.replace(/[^\d]/g, '');
              if (this.value.length > 12) {
                this.value = this.value.slice(0, 12);
              }
            });
          }
        }, 0);
      },
      preConfirm: () => {
        const nombreCompleto = document.getElementById('nombreCompleto').value;
        const correo = document.getElementById('correo').value;
        const telefono = parseInt(document.getElementById('telefono').value);
        const numberIdentity = parseInt(document.getElementById('numberIdentity').value);
        const plus = parseInt(document.getElementById('plus').value);
        const extension = document.getElementById('extension').value;
        const stringIdentity = identidadSelect.current.getSelectedRole();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!nombreCompleto) {
          Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el nombre del cliente</div>');
          return false;
        }
        if (document.getElementById('correo').value !== "" && !emailRegex.test(correo)) {
          Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un correo electrónico válido para el cliente</div>');
          return false;
        }

        if (document.getElementById('telefono').value !== "" && (isNaN(telefono) || telefono < 60000000 || telefono > 79999999)) {
          Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese un número de teléfono válido, si es requerido</div>');
          return false;
        }
        if (!numberIdentity) {
          Swal.showValidationMessage('<div class="custom-validation-message">Por favor ingrese el numero de identificacion del cliente</div>');
          return false;
        }
        if (!stringIdentity) {
          Swal.showValidationMessage('<div class="custom-validation-message">Por favor seleccione el tipo de identificacion del cliente</div>');
          return false;
        }

        return { nombreCompleto, correo, telefono, numberIdentity, plus, stringIdentity, extension };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombreCompleto, correo, telefono, numberIdentity, plus, stringIdentity, extension } = result.value;
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
          usuario_,
        };
        
        axios.post(`${UrlReact}/cliente/crear`, nuevoCliente, configInicial)
          .then(response => {
            setClientes(response.clientes);
            CustomSwal({ icono: 'success', titulo: 'Cliente Creado', mensaje: response.mensaje });
          })
          .catch(error => {
            console.log(error);
            CustomSwal({ icono: 'error', titulo: 'Error al crear el cliente', mensaje: error.mensaje });
          });
      }
    });
};

  return (
  <>
    <Grid item xs={12} sm={8} sx={{padding: 'auto',}}>
      <Autocomplete
        options={clientes}
        getOptionLabel={(option) => option.nombreCompleto + ' - ' + option.numberIdentity }
        value={idcliente}
        onChange={(event, newValue) => {
          setIdCliente(newValue);
        }}
        inputValue={inputCliente}
        onInputChange={(event, newInputValue) => {
          setInputCliente(newInputValue);
        }}
        renderInput={(params) => (
        <TextField {...params} label="Elija al cliente" variant="outlined" fullWidth 
          InputProps={{
            ...params.InputProps,
            sx: { backgroundColor: '#e2e2e2', color: '#0f1b35' } // Cambia el color de fondo y del texto aquí
          }}
          sx={{
            backgroundColor: '#0f1b35', // Cambia el color de fondo del TextField aquí
              '& .MuiOutlinedInput-root': {
              '& fieldset': {
              borderColor: '#0f1b35', // Cambia el color del borde aquí
              },
              '&:hover fieldset': {
              borderColor: '#0f1b35', // Cambia el color del borde al pasar el ratón aquí
              },
            },
              '& .MuiInputLabel-root': {
              color: '#0095b0',
              backgroundColor: '#e2e2e2',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0095b0',
                backgroundColor: '#e2e2e2',
                fontSize: '25px',
              },
          }}
          />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option._id}>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="body1" component="span" sx={{ color: 'primary.main' }}>
                    {option.nombreCompleto}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="span">
                {` - ${option.numberIdentity} - ${option.stringIdentity.nombre}`}
              </Typography>
            </Grid>
          </Grid>
        </li>
      )}
      />
    </Grid>
    <Grid item xs={12} sm={4} sx={{margin:'auto'}}>
      <Button
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      onClick={btnRegistrarCliente}
      sx={{
        backgroundColor: '#e2e2e2',
        color: '#0f1b35',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#1a7b13',
          color: '#e2e2e2',
          border: '2px solid #e2e2e2',
        },
      }}
      >Añadir Nuevo Cliente
      </Button>
    </Grid>
  </>
  );
};

export default CustomAutocompleteCliente;
