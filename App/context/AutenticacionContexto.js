import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AutenticarContexto = createContext();

export function AutenticarContextoProveedor({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedRol = await AsyncStorage.getItem('rol');
      if (token && storedRol === 'Administrador') {
        setId(await AsyncStorage.getItem('id'));
        setNombre(await AsyncStorage.getItem('nombre'));
        setRol(storedRol);
        setAutenticado(true);
      }
    };
    cargarDatos();
  }, []);

  const iniciarSesion = useCallback(async (id, nombre, rol, token) => {
    if (rol === 'Administrador') {
      await AsyncStorage.setItem('id', id);
      await AsyncStorage.setItem('nombre', nombre);
      await AsyncStorage.setItem('rol', rol);
      await AsyncStorage.setItem('token', token);
      setId(id);
      setNombre(nombre);
      setRol(rol);
      setAutenticado(true);
    } else {
      setAutenticado(false);
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
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
  children: PropTypes.node.isRequired,
};

export function useAutenticarContexto() {
  return useContext(AutenticarContexto);
}
