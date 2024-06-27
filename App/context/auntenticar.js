import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AutenticarContexto = createContext();

export function AutenticarContextoProveedor({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      const token = await AsyncStorage.getItem('token');
      const id = await AsyncStorage.getItem('id');
      const nombre = await AsyncStorage.getItem('nombre');
      const rol = await AsyncStorage.getItem('rol');
      
      if (token) {
        setAutenticado(true);
        setId(id);
        setNombre(nombre);
        setRol(rol);
      }
    }

    cargarDatos();
  }, []);

  const iniciarSesion = useCallback(async function(id, nombre, rol, token) {
    await AsyncStorage.setItem('id', id);
    await AsyncStorage.setItem('nombre', nombre);
    await AsyncStorage.setItem('rol', rol);
    await AsyncStorage.setItem('token', token);
    
    setId(id);
    setNombre(nombre);
    setRol(rol);
    setAutenticado(true);
  }, []);

  const cerrarSesion = useCallback(async function() {
    await AsyncStorage.removeItem('id');
    await AsyncStorage.removeItem('nombre');
    await AsyncStorage.removeItem('rol');
    await AsyncStorage.removeItem('token');
    
    setId(null);
    setNombre(null);
    setRol(null);
    setAutenticado(false);
  }, []);

  const datos = useMemo(
    () => ({
      iniciarSesion,
      cerrarSesion,
      id,
      nombre,
      rol,
      autenticado
    }),
    [iniciarSesion, cerrarSesion, id, nombre, rol, autenticado]
  );

  return <AutenticarContexto.Provider value={datos}>{children}</AutenticarContexto.Provider>;
}

AutenticarContextoProveedor.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAutenticarContexto() {
  return useContext(AutenticarContexto);
}
