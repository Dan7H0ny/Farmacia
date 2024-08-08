import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 10, // Ajustar el espacio inferior para acercar al contenido
    marginTop: 50, // Ajustar el espacio superior para alejar del borde
  },
  searchInput: {
    height: 40,
    borderColor: '#0f1b35',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#e2e2e2',
    color: '#0f1b35',
  },
  itemText: {
    fontSize: 18,
    color: '#e2e2e2',
    textAlign: 'center', // Centrar el texto
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    backgroundColor: '#0f1b35', // Cambiar color de fondo
    borderRadius: 5,
    width: '100%', // Asegurarse de que ocupe todo el ancho
  },
  switch: {
    marginLeft: 10,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centrar contenido de la lista
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#0f1b35',
    borderRadius: 5,
  },
  paginationText: {
    fontSize: 16,
    color: '#e2e2e2',
    backgroundColor: '#0f1b35',
  },
});