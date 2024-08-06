import { showMessage, hideMessage } from 'react-native-flash-message';
import CustomCarga from './CustomCarga'; // Asegúrate de importar tu componente de carga

const CustomSwal = ({ icono, titulo, mensaje, loading }) => {
  if (loading) {
    showMessage({
      message: titulo,
      description: mensaje,
      type: 'info',
      renderCustomContent: () => <CustomCarga color="#e2e2e2" size="large" />,
      duration: 0, // Muestra el mensaje indefinidamente hasta que se cierre manualmente
    });
  } else {
    showMessage({
      message: titulo,
      description: mensaje,
      type: icono === 'success' ? 'success' : 'danger',
      duration: 3000,
    });
  }
  return null;
};

export default CustomSwal;
