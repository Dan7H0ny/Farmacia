import { showMessage } from "react-native-flash-message";

const CustomSwal = ({ icono, titulo, mensaje }) => {
  showMessage({
    message: titulo,
    description: mensaje,
    type: icono === 'success' ? 'success' : 'danger',
  });

  return null;
};

export default CustomSwal;
