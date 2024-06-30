import Swal from 'sweetalert2';
import '../assets/css/swal.css';

const CustomSwal = ({ icono, titulo, mensaje }) => {
  // Mostrar la notificación con estilos personalizados
  Swal.fire({
    icon: icono,
    title: titulo,
    text: mensaje,
    customClass: {
      popup: 'custom-swal-popup',
      title: 'login-modal custom-swal-title',
      confirmButton: 'swal2-confirm custom-swal2-confirm',  
      cancelButton: 'swal2-cancel custom-swal2-cancel',
    },
  });

  return null; // No renderizar nada, ya que SweetAlert2 se encarga de mostrar la notificación
};

export default CustomSwal;

