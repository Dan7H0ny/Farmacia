import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import logoBase64 from './logoBase64';
export const generarPDFPersonalizado = (usuario) => {
  const doc = new jsPDF();

  // Configuración de la tabla
  const tablaEncabezado = [['Campo', 'Valor']];
  const tablaDatos = [];
  const opciones = {
    incluirNombre: true,
    incluirApellido: true,
    incluirCorreo: true,
    incluirDireccion: true,
    incluirRol: true,
    incluirTelefono: true,
    incluirEstado: true,
    incluirFechaRegistro: true,
    incluirFechaActualizacion: true,
    titulo: 'REPORTE DEL PERFIL DEL USUARIO',
    nombreArchivo: `Reporte_${usuario.nombre}_${usuario.apellido}.pdf`,
    colorFondo: '#0f1b35', // Color de fondo oscuro azul
    colorTexto: '#e2e2e2', // Color de texto gris claro
    colorEncabezado: '#000000', // Color del encabezado en negro
    tamanoFuente: 14,
    logo: logoBase64,
    firma: 'Firma de Ezequiel',
    anchoColumna1: 40,
    anchoColumna2: 100,
  };

  if (opciones.incluirNombre) tablaDatos.push(['Nombre', usuario.nombre]);
  if (opciones.incluirApellido) tablaDatos.push(['Apellido', usuario.apellido]);
  if (opciones.incluirCorreo) tablaDatos.push(['Correo', usuario.correo]);
  if (opciones.incluirDireccion) tablaDatos.push(['Dirección', usuario.direccion]);
  if (opciones.incluirRol) tablaDatos.push(['Rol', usuario.rol]);
  if (opciones.incluirTelefono) tablaDatos.push(['Teléfono', usuario.telefono]);
  if (opciones.incluirEstado) tablaDatos.push(['Estado', usuario.estado ? 'Activo' : 'Inactivo']);
  if (opciones.incluirFechaRegistro) tablaDatos.push(['Fecha de Registro', usuario.fecha_registro]);
  if (opciones.incluirFechaActualizacion) tablaDatos.push(['Fecha de Actualización', usuario.fecha_actualizacion]);

  // Configurar márgenes y ancho de la tabla
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // Margen lateral para la tabla
  const pageCenter = pageWidth / 2; // Centro de la página
  const tableWidth = pageWidth - 2 * margin;

  // Opciones de autoTable para personalización
  const autoTableOptions = {
    startY: 20,
    margin: { horizontal: margin },
    tableWidth: tableWidth, // Asegurar que la tabla se ajuste al margen
    head: tablaEncabezado,
    body: tablaDatos,
    styles: {
      font: "helvetica",
      fillColor: opciones.colorFondo,
      textColor: opciones.colorTexto,
      fontSize: opciones.tamanoFuente,
      lineColor: '#ffffff',
      lineWidth: 0.5
    },
    headStyles: {
      fillColor: opciones.colorEncabezado,
      textColor: '#ffffff',
      fontStyle: 'bold',
      halign: 'center', // Alinear encabezados al centro
    },
    alternateRowStyles: {
      fillColor: '#192244'
    }
  };

  // Agregar título centrado al PDF
  doc.text(opciones.titulo, pageCenter, 10, { align: 'center' });
  doc.autoTable(autoTableOptions);

  // Añadir el logo y la firma
  doc.addImage(opciones.logo, 'JPEG', margin, pageHeight - 30, 40, 20); // Ajusta las dimensiones según sea necesario
  const firmaX = pageWidth - margin - 60; // Posición X para la firma
  doc.text(opciones.firma, firmaX, pageHeight - 15, { align: 'left' });
  doc.line(firmaX, pageHeight - 10, firmaX + 60, pageHeight - 10); // Dibuja la línea para la firma

  // Pie de página con números de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, pageCenter, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  // Guardar el PDF con el nombre especificado
  doc.save(opciones.nombreArchivo);
};
