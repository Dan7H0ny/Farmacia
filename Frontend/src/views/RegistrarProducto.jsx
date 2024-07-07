import React, {useState, useEffect} from 'react';
import {  Box , Grid, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ProductionQuantityLimits, DateRange, Description, AddBusiness, AllInbox, Inventory} from '@mui/icons-material';
import '../assets/css/menu.css';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelect from '../components/CustomSelect';
import CustomSelectProveedor from '../components/CustomSelectProveedor';

const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
const token = obtenerToken();
const configInicial = { headers: { Authorization: `Bearer ${token}` }};

export const RegistrarProducto = () => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [proveedor, setProveedor] = useState([]);
  const [idproveedor, setIdProveedor] = useState([]);
  const [precioCompra, setPrecioCompra] = useState('');
  const [capacidad_presentacion, setCapacidadPres] = useState('');
  const [fecha_caducidad, setFechaCaducidad] = useState('');
  const usuario_ = localStorage.getItem('id');
  const [ tipos, setTipos ] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${UrlReact}/proveedor/mostrar`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setProveedor(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  useEffect(() => {
    const nombre = 'TIPOS'
    axios.get(`${UrlReact}/complemento/buscarNombre/${nombre}`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setTipos(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate]);

  const CrearProducto = (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    }
    else
    {
      const data = { nombre, tipo, descripcion, proveedor: idproveedor, precioCompra, capacidad_presentacion, usuario: usuario_, fecha_caducidad };
      console.log(data)
      axios.post(`${UrlReact}/producto/crear`, data, configInicial)
        .then(response => {
          CustomSwal({ icono: 'success', titulo: 'Producto Creado', mensaje: response.mensaje});
          limpiarFormulario();
        })
        .catch(error => {
          CustomSwal({ icono: 'error', titulo: 'Error al crear el Producto', mensaje: error.mensaje});
        });
    }
  };
  const limpiarFormulario = () => {
    document.getElementById("Form-1").reset();
  }

  return (
    <div id="caja_contenido">
      <Box mt={3}>
        <CustomTypography text={'Registro de Productos'} />
        <form id="Form-1" onSubmit={CrearProducto} className="custom-form">
          <Grid container spacing={3}>
            <CustomRegisterUser
              number={8}
              label="Nombre del Producto" 
              placeholder= 'Ingrese el nombre del producto'
              type= 'text'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required={true}
              icon={<ProductionQuantityLimits/>}
            />
            <CustomRegisterUser
              number={4}
              label="Capacidad Presentacion" 
              placeholder= 'Ingrese la capacidad de presentacion'
              type= 'Number'
              value={capacidad_presentacion}
              onChange={(e) => setCapacidadPres(e.target.value)}
              required={true}
              icon={<Inventory/>}
            />
            <Grid container item xs={3} spacing={1} sx={{marginTop: 1}}>
              <CustomSelectProveedor
                number={12}
                id="select-proveedor"
                label="Seleccione el proveedor"
                value={idproveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                roles={proveedor}
                icon={<AddBusiness />}
              />
              <CustomRegisterUser
                number={12}
                label="Precio" 
                placeholder= 'Ingrese el precio de la compra'
                type= 'Number'
                required={true}
                value={precioCompra}
                onChange={(e) => setPrecioCompra(e.target.value)}
                icon={<Description/>}
              /> 
            </Grid>
            <Grid container item xs={3} spacing={1} sx={{marginTop: 1}}>
              <CustomSelect
                number={12}
                id="select-tipo"
                label="Seleccione el tipo de presentacion"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                roles={tipos}
                icon={<AllInbox />}
              />
              <CustomRegisterUser
                number={12}
                label="Fecha Caducidad" 
                placeholder= 'Ingrese la fecha de caducidad del producto'
                type= 'date'
                value={fecha_caducidad}
                onChange={(e) => setFechaCaducidad(e.target.value)}
                required={true}
                icon={<DateRange/>}
              />
            </Grid>
            <CustomRegisterUser
              number={6}
              label="Descripcion" 
              placeholder= 'Ingrese la descripcion del producto'
              type= 'text'
              rows={5}
              multiline= {true} 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required={false}
              icon={<Description/>}
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
            >Guardar Producto
            </Button>
        </form>
      </Box>
    </div>
  );
};



