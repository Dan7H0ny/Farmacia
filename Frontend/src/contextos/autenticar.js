import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export const AutenticarContexto = createContext()

export function AutenticarContextoProveedor({ children }) {
  const [autenticado, setAutenticado] = useState(window.localStorage.getItem('token') ?? false)
  const [id, setId] = useState(window.localStorage.getItem('id') ?? false)
  const [nombre, setnombre] = useState(window.localStorage.getItem('nombre') ?? false)
  const [rol, setRol] = useState(window.localStorage.getItem('rol') ?? false)

  const iniciarSesion = useCallback(function(id, nombre, rol, token) {
    window.localStorage.setItem('id', id)
    window.localStorage.setItem('nombre', nombre)
    window.localStorage.setItem('rol', rol)
    window.localStorage.setItem('token', token)
    setId(id)
    setnombre(nombre)
    setRol(rol)
    setAutenticado(true)
  }, []);

  const cerrarSesion = useCallback(function() {
    window.localStorage.removeItem('id')
    window.localStorage.removeItem('nombre')
    window.localStorage.removeItem('rol')
    window.localStorage.removeItem('token')
    setId(null)
    setnombre(null)
    setRol(null)
    setAutenticado(false)
  }, [])

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
  )

  return <AutenticarContexto.Provider value={ datos }>{ children }</AutenticarContexto.Provider>
}

AutenticarContextoProveedor.propTypes = {
  children: PropTypes.object
}

export function useAutenticarContexto() {
  return useContext(AutenticarContexto)
}
