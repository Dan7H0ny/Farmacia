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
    marginBottom: 10,
    marginTop: 50,
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
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    backgroundColor: '#0f1b35',
    borderRadius: 5,
    width: '100%',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    padding: 10,
    marginLeft: 5,
    backgroundColor: '#0a2a43',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCantidad: {
    height: 40,
    borderColor: '#0f1b35',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#e2e2e2',
    color: '#0f1b35',
    width: 50, // Ajusta el ancho según sea necesario
    marginRight: 5, // Espacio entre el campo de entrada y los botones
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#0a2a43',
    borderRadius: 5,
  },
  paginationText: {
    color: '#e2e2e2',
    fontSize: 16,
    backgroundColor:'#0a2a43'
  },
});
