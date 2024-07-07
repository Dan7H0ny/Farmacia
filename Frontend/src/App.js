import './assets/css/App.css';
import React, { } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAutenticarContexto  } from './contextos/autenticar';
import { RegistrarComplementos  } from './views/RegistrarComplementos';

import { Login } from './views/Login';

import { MenuAdministrador } from './views/MenuAdministrador';
import { MenuCajero } from './views/MenuCajero';

import { Dashboard } from './views/Dashboard'; 

import { RegistrarUsuario } from './views/RegistrarUsuario';
import { ListarUsuario } from './views/ListarUsuario';

import { RegistrarCliente } from './views/RegistrarCliente';
import { ListarCliente } from './views/ListarCliente';

import { RegistrarProveedor } from './views/RegistrarProveedor';
import { ListarProveedor } from './components/ListarProveedor';

import { RegistrarProducto } from './components/RegistrarProducto';
import { ListarProducto } from './components/ListarProducto';

import { RegistrarVenta } from './components/RegistrarVenta';
import { ListarVenta } from './components/ListarVenta';

function App() {
  const { rol } = useAutenticarContexto();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route exact path="/login" element={<Login/>}/>
          {rol === 'Administrador' && (
            <Route path="/Menu/Administrador" element={<MenuAdministrador/>}>
              <Route exact path="/Menu/Administrador/Dashboard" element={<Dashboard/>}/>
              <Route exact path="/Menu/Administrador/Usuario/Registrar" element={<RegistrarUsuario/>}/>
              <Route exact path="/Menu/Administrador/Usuario/Listar" element={<ListarUsuario/>}/>
              <Route exact path="/Menu/Administrador/Cliente/Registrar" element={<RegistrarCliente/>}/>
              <Route exact path="/Menu/Administrador/Cliente/Listar" element={<ListarCliente/>}/>
              <Route exact path="/Menu/Administrador/Proveedor/Registrar" element={<RegistrarProveedor/>}/>
              <Route exact path="/Menu/Administrador/Proveedor/Listar" element={<ListarProveedor/>}/>
              <Route exact path="/Menu/Administrador/Complemento/Registrar" element={<RegistrarComplementos/>}/>
              <Route exact path="/Menu/Administrador/Producto/Registrar" element={<RegistrarProducto/>}/>
              <Route exact path="/Menu/Administrador/Producto/Listar" element={<ListarProducto/>}/>
              <Route exact path="/Menu/Administrador/Venta/Registrar" element={<RegistrarVenta/>}/>
              <Route exact path="/Menu/Administrador/Venta/Listar" element={<ListarVenta/>}/>
            </Route>
          )}
          {rol === 'Cajero' && (
            <Route path="/Menu/Cajero" element={<MenuCajero/>}>
              <Route exact path="/Menu/Cajero/Cliente/Registrar" element={<RegistrarCliente/>}/>
              <Route exact path="/Menu/Cajero/Cliente/Listar" element={<ListarCliente/>}/>
              <Route exact path="/Menu/Cajero/Venta/Registrar" element={<RegistrarVenta/>}/>
              <Route exact path="/Menu/Cajero/Venta/Listar" element={<ListarVenta/>}/>
            </Route>
          )}

          {rol !== 'Administrador' && rol !== 'Cajero' && (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;


