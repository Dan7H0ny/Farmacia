import React, {useState, useEffect, useMemo} from 'react';
import {  Box , Grid, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ProductionQuantityLimits, AttachMoney, Description, AddBusiness, AllInbox, Inventory} from '@mui/icons-material';
import '../assets/css/menu.css';
import CustomTypography from '../components/CustomTypography';
import CustomSwal from '../components/CustomSwal';
import CustomRegisterUser from '../components/CustomRegisterUser';
import CustomSelectCom from '../components/CustomSelectCom';
import CustomSelectProveedor from '../components/CustomSelectProveedor';

export const RegistrarProducto = () => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [proveedor, setProveedor] = useState([]);
  const [idproveedor, setIdProveedor] = useState([]);
  const [precioCompra, setPrecioCompra] = useState('');
  const [capacidad_presentacion, setCapacidadPres] = useState('');
  const usuario_ = localStorage.getItem('id');
  const [ tipos, setTipos ] = useState([]);
  
  const navigate = useNavigate();
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);
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
  },[navigate, token, configInicial, UrlReact]);

  useEffect(() => {
    const nombre = 'Tipo'
    axios.get(`${UrlReact}/complemento/buscarNombre/${nombre}`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
          navigate('/Menu/Administrador')
        }
        else {setTipos(response);}
      })
      .catch(error => { console.log(error);});
  }, [navigate, token, configInicial, UrlReact]);

  const CrearProducto = (e) => {
    e.preventDefault();
    if (!token) {
      CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
      navigate('/Menu/Administrador')
      return;
    }
    else
    {
      const data = { nombre, tipo, descripcion, proveedor: idproveedor, precioCompra, capacidad_presentacion, usuario_registro: usuario_, usuario_actualizacion: usuario_ };
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
    setNombre("");
    setCapacidadPres("");
    setDescripcion("");
    setPrecioCompra("");
    setTipo("");
    setIdProveedor("");
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
              onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}
            />
            <CustomRegisterUser
              number={12}
              label="Descripcion" 
              placeholder= 'Ingrese la descripcion del producto'
              type= 'text'
              rows={2.5}
              multiline= {true} 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required={false}
              icon={<Description/>}
            />
            <CustomRegisterUser
              number={4}
              label="Precio" 
              placeholder= 'Ingrese el precio de la compra'
              type= 'Number'
              required={true}
              value={precioCompra}
              onChange={(e) => {if (/^\d*\.?\d{0,2}$/.test(e.target.value)) {setPrecioCompra(e.target.value);}}}
              icon={<AttachMoney/>}
              onKeyPress={(e) => { if (!/[\d.]$/.test(e.key) || (e.key === '.' && precioCompra.includes('.'))) {e.preventDefault();}}}
            /> 
            <CustomSelectCom
              number={4}
              id="select-tipo"
              label="Seleccione el tipo de presentacion"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              roles={tipos}
              icon={<AllInbox />}
            />
            <CustomSelectProveedor
              number={4}
              id="select-proveedor"
              label="Seleccione un proveedor"
              value={idproveedor}
              onChange={(e) => setIdProveedor(e.target.value)}
              roles={proveedor}
              icon={<AddBusiness />}
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



