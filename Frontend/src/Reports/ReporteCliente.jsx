import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import logoBase64 from './logoBase64';

export const ReporteCliente = (cliente, usuario) => {
  const doc = new jsPDF({
    format: 'letter' // Especificar que el formato es carta
  });  

  // Configuración de la tabla
  const tablaEncabezado = [['ATRIBUTOS', 'DATOS']];
  const tablaDatos = [];
  const opciones = {
    incluirDatos: true,
    titulo: 'REPORTE DEL PERFIL DEL CLIENTE',
    nombreArchivo: `Reporte de ${cliente.nombreCompleto}.pdf`,
    colorFondo: '#0f1b35', // Color de fondo oscuro azul
    colorTexto: '#e2e2e2', // Color de texto gris claro
    colorEncabezado: '#000000', // Color del encabezado en negro
    tamanoFuente: 14,
    logo: logoBase64,
    firma: `Lic. ${usuario.nombre} ${usuario.apellido}`,
    anchoColumnaAtributos: 50,
    fechaImpresion: formatDateTime(new Date()),
  };

  function formatDateTime(date) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
    const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
    return `${formattedDate} ${formattedTime}`;
  }

  if (opciones.incluirDatos) tablaDatos.push(['Nombre del Cliente:', cliente.nombreCompleto]);
  if (opciones.incluirDatos) tablaDatos.push(['Correo del Cliente:', cliente.correo ? cliente.correo : 's/n']);
  if (opciones.incluirDatos) tablaDatos.push(['Telefono del Cliente:', cliente.telefono ? cliente.telefono: 's/n']);
  if (opciones.incluirDatos) tablaDatos.push(['Numero de Identidad del Cliente:', cliente.combinedIdentity]);
  if (opciones.incluirDatos) tablaDatos.push(['Extension:', cliente.extension ? cliente.extension : 's/n']);
  if (opciones.incluirDatos) tablaDatos.push(['Tipo de Identidad del Cliente:', cliente.stringIdentity.nombre]);
  if (opciones.incluirDatos) tablaDatos.push(['Usuario que registro:', cliente.usuario_registro.nombre + ' ' + cliente.usuario_registro.apellido ]);
  if (opciones.incluirDatos) tablaDatos.push(['Usuario que actualizo:', cliente.usuario_actualizacion.nombre + ' ' + cliente.usuario_actualizacion.apellido ]);
  if (opciones.incluirDatos) tablaDatos.push(['Fecha de Registro', formatDateTime(new Date(cliente.fecha_registro))]);
  if (opciones.incluirDatos) tablaDatos.push(['Fecha de Actualización', formatDateTime(new Date(cliente.fecha_actualizacion))]);

  // Configurar márgenes y ancho de la tabla
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25; // Margen lateral para la tabla

  // Configuración de autoTable
  const autoTableOptions = {
    startY: 50,
    margin: { horizontal: margin },
    tableWidth: 'auto',
    theme: 'grid',
    head: tablaEncabezado,
    body: tablaDatos,
    didDrawPage: function () {
      const logoWidth = 50; 
      const logoHeight = 25; 
      const logoX = 5; 
      const logoY = 5; 
      doc.addImage(opciones.logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

      doc.setFontSize(10);
      doc.text(`FECHA DE IMPRESIÓN: ${opciones.fechaImpresion}`, pageWidth - 10, 20, { align: 'right' });
      doc.setFontSize(20);
      doc.text(opciones.titulo, pageWidth / 2, 40, { align: 'center' });
    },
    styles: {
      font: "helvetica",
      fillColor: '#ffffff',
      textColor: '#000000',
      fontSize: 12,
      lineColor: '#dddddd',
      lineWidth: 1
    },
    headStyles: {
      fillColor: '#cccccc',
      textColor: '#000000',
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: opciones.anchoColumnaAtributos }, // Ancho fijo para la columna de atributos
      1: { cellWidth: 'auto' } // Ancho automático para la columna de datos
    },
  };

  // Dibujar la tabla en el PDF
  doc.autoTable(autoTableOptions);

  // Añadir la firma debajo de la tabla
  const finalY = doc.lastAutoTable.finalY || 25; // `finalY` es la posición Y donde termina la última tabla
  const firmaX = pageWidth / 2; // Posición X para la firma, centrada
  doc.line(firmaX - 30, finalY + 35, firmaX + 30, finalY + 35); // Dibuja la línea para la firma
  doc.setFontSize(12);
  doc.text(opciones.firma, firmaX, finalY + 40, { align: 'center' });

  // Añadir números de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  doc.save(opciones.nombreArchivo);
};
