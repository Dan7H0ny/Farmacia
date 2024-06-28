import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formContainer: {
    width: '90%',   
    padding: 20,
    backgroundColor: '#0f1b35', // Fondo oscuro
    borderRadius: 10, // Bordes redondeados
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5, // Espacio debajo del icono
  },
  logo: {
    width: '70%', // Usa un porcentaje para el ancho
    height: undefined, // Deja que la altura se ajuste automáticamente
    aspectRatio: 1, // Mantén la proporción del logo
  },
  title: {
    fontSize: 24,
    color: '#e2e2e2',
    textAlign: 'center',
    marginBottom: 20, // Espacio debajo del título
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco para el input
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    color: '#000', // Color del texto en el input
    padding: 10,
  },
  buttonContainer: {
    marginBottom: 20, // Espacio entre los botones
  },
  button: {
    backgroundColor: '#e2e2e2', // Fondo claro para los botones
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#0f1b35', // Color del texto en el botón
    textAlign: 'center',
  },
});
