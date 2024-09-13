import './assets/css/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAutenticarContexto } from './contextos/autenticar';
import { RegistrarComplementos } from './views/RegistrarComplementos';
import { Login } from './views/Login';
import { RPassword } from './views/RPassword';
import { MenuAdministrador } from './views/MenuAdministrador';
import { MenuCajero } from './views/MenuCajero';
import { RegistrarUsuario } from './views/RegistrarUsuario';
import { ListarUsuario } from './views/ListarUsuario';
import { ListarCliente } from './views/ListarCliente';
import { RegistrarProveedor } from './views/RegistrarProveedor';
import { ListarProveedor } from './views/ListarProveedor';
import { RegistrarProducto } from './views/RegistrarProducto';
import { ListarProducto } from './views/ListarProducto';
import { RegistrarAlmacen } from './views/RegistrarAlmacen';
import { ListarAlmacen } from './views/ListarAlmacen';
import { RegistrarVenta } from './views/RegistrarVenta';
import { ListarVenta } from './views/ListarVenta';
import { ActualizarVenta } from './components/ActualizarVenta';

function App() {
  const { rol } = useAutenticarContexto();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/restablecer-contraseña/:IdUsuario" element={<RPassword />} />
          {rol === 'Administrador' && (
            <Route path="/Menu/Administrador" element={<MenuAdministrador />}>
              <Route path="Usuario/Registrar" element={<RegistrarUsuario />} />
              <Route path="Usuario/Listar" element={<ListarUsuario />} />
              <Route path="Cliente/Listar" element={<ListarCliente />} />
              <Route path="Proveedor/Registrar" element={<RegistrarProveedor />} />
              <Route path="Proveedor/Listar" element={<ListarProveedor />} />
              <Route path="Complemento/Registrar" element={<RegistrarComplementos />} />
              <Route path="Producto/Registrar" element={<RegistrarProducto />} />
              <Route path="Producto/Listar" element={<ListarProducto />} />
              <Route path="Almacen/Registrar" element={<RegistrarAlmacen />} />
              <Route path="Almacen/Listar" element={<ListarAlmacen />} />
              <Route path="Venta/Registrar" element={<RegistrarVenta />} />
              <Route path="Venta/Listar" element={<ListarVenta />} />
              <Route path="Venta/Actualizar/:ventaId" element={<ActualizarVenta />} />
            </Route>
          )}
          {rol === 'Cajero' && (
            <Route path="/Menu/Cajero" element={<MenuCajero />}>
              <Route path="Complemento/Registrar" element={<RegistrarComplementos />} />
              <Route path="Cliente/Listar" element={<ListarCliente />} />
              <Route path="Venta/Registrar" element={<RegistrarVenta />} />
              <Route path="Venta/Listar" element={<ListarVenta />} />
              <Route path="Venta/Actualizar/:ventaId" element={<ActualizarVenta />} />
            </Route>
          )}
          {(rol !== 'Administrador' && rol !== 'Cajero') && (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
