import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Asegura que el contenido se centre verticalmente
    alignItems: 'center', // Asegura que el contenido se centre horizontalmente
    padding: 10,
  },
  menuItem: {
    width: '80%', // Aumenta el ancho para mejor visualización en la pantalla
    height: 100,
    justifyContent: 'center', // Centra el contenido del botón verticalmente
    alignItems: 'center', // Centra el contenido del botón horizontalmente
    backgroundColor: '#0f1b35',
    margin: 10,
    borderRadius: 10,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});
