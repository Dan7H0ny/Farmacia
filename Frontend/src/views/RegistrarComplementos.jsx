import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, Grid, Box } from '@mui/material';
import { DevicesOther, SettingsInputComponent, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomSelect from '../components/CustomSelect';
import CustomSelectComponents from '../components/CustomSelectComponents';
import '../assets/css/menu.css';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomTablaC from '../components/CustomTablaC';
import { createRoot } from 'react-dom/client';
import CustomActualizarUser from '../components/CustomActualizarUser';

export const RegistrarComplementos = () => {
  const [nombreComplemento, setnombreComplemento] = useState('');
  const [nombre, setNombre] = useState('');
  const [buscar, setBuscar] = useState('');
  const [complemento, setComplementos] = useState([]);
  const navigate = useNavigate();

  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const complementos = [
    { nombre: 'Identificación' },
    { nombre: 'Tipo' },
    { nombre: 'Categoría' },
  ];

  useEffect(() => {
    axios.get(`${UrlReact}/complemento/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setComplementos(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact]);
  
  const btnRegistrarComplemento = (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    }
    else{
      const NuevoComplemento = { nombreComplemento, nombre };
      axios.post(`${UrlReact}/complemento/crear`, NuevoComplemento, configInicial)
        .then(response => {
          CustomSwal({ icono: 'success', titulo: 'Usuario Creado', mensaje: response.mensaje});
          setComplementos(prevComplementos => [...prevComplementos, response.nuevoComplemento]);
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
    setnombreComplemento("");
  };

  const btnActualizar = (complemento) => {
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso' });
      navigate('/Menu/Administrador');
    } else {
      axios.get(`${UrlReact}/complemento/buscar/${complemento._id}`, configInicial)
        .then(response => {
          const { _id, nombreComplemento, nombre } = response;
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <Grid container spacing={2}>
              <CustomSelectComponents number={6} id="identidad-select" label="Seleccione el tipo complemento" value={nombreComplemento} roles={complementos} icon={<DevicesOther />}/>
              <CustomActualizarUser number={6} id="nombre" label="Nombre Complemento" type="text" defaultValue={nombre} required={true} icon={<SettingsInputComponent />} />
            </Grid>
          );
          Swal.fire({
            title: 'ACTUALIZAR EL COMPLEMENTO',
            html: container,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
              const nombreComplemento_ = document.getElementById('identidad-select').textContent;
              const nombre_ = document.getElementById('nombre').value;
              return { nombreComplemento_, nombre_, };
            },
          customClass: {
            popup: 'customs-swal-popup',
            title: 'customs-swal-title',
            confirmButton: 'swal2-confirm custom-swal2-confirm',
            cancelButton: 'swal2-cancel custom-swal2-cancel',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { nombreComplemento_, nombre_ } = result.value;
            axios.put(`${UrlReact}/complemento/actualizar/${_id}`, {
              nombreComplemento: nombreComplemento_,
              nombre: nombre_,
            }, configInicial)
            .then((response) => {
              setComplementos(prevComplementos => 
                prevComplementos.map(comp => 
                  comp._id === _id ? { ...comp, nombreComplemento: nombreComplemento_, nombre: nombre_ } : comp
                )
              );
              CustomSwal({ icono: 'success', titulo: 'Actualización Exitosa', mensaje: response.mensaje });
            })
          .catch((error) => {
            CustomSwal({ icono: 'error', titulo: 'Error al actualizar', mensaje: error.mensaje });
          });
        }
      });
    })
    .catch(error => {
      CustomSwal({ icono: 'error', titulo: 'Error al actualizar el Usuario', mensaje: error.mensaje });
    });
    }
  };

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registro de Complementos'} />
        <Grid container spacing={3}>
        <Grid item xs={12} sm={5}>
          <form id="Form-1" onSubmit={btnRegistrarComplemento} className="custom-form">
            <Grid container spacing={3}>
              <CustomSelect
                number ={12}
                id="select-rol"
                label="Seleccione un tipo de complemento"
                value={nombreComplemento}
                onChange={(e) => setnombreComplemento(e.target.value)}
                roles={complementos}
                icon={<DevicesOther/>}
              />
              <CustomRegisterUser
                number={12}
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
        </Grid>
        <Grid item xs={12} sm={7}>
          <form id="Form-2" className="custom-form" style={{ padding: 15}}>
            <CustomRegisterUser
              number={12}
              label="Nombre"  
              placeholder= 'Buscar el nombre del complemento'
              type= 'text'
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              required={false}
              icon={<Search/>}
            />
          </form>
          <CustomTablaC usuarios={complemento} buscar={buscar} botonActualizar={btnActualizar}/>
        </Grid>
        </Grid>
      </Box>
    </div>
  );
};
