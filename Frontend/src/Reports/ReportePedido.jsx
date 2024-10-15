import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import logoBase64 from './logoBase64';

export const ReportePedido = (pedido, usuario) => {
  const doc = new jsPDF({
    format: 'letter' // Especificar que el formato es carta
  });

  const opciones = {
    titulo: 'Reporte del pedido',
    nombreArchivo: `Reporte del pedido de (${pedido.proveedor}).pdf`,
    logo: logoBase64,
    firma: `Lic. ${usuario.nombre} ${usuario.apellido}`,
    fechaImpresion: formatDateTime(new Date()),
    tamanoFuente: 12,
  };

  function formatDateTime(date) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
    const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
    return `${formattedDate} ${formattedTime}`;
  }

  // Configuración inicial del documento
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const maxProductosPorPagina = 9;
  const maxProductosPrimeraPagina = 7;

  // Función para añadir encabezado en cada página
  const addHeader = () => {
    doc.addImage(opciones.logo, 'PNG', 5, 5, 50, 25);
    doc.setFontSize(10);
    doc.text(`FECHA DE IMPRESIÓN: ${opciones.fechaImpresion}`, pageWidth - margin, 20, { align: 'right' });
  };

  // Añadir encabezado en la primera página
  addHeader();

  doc.setFontSize(20);
  doc.text(opciones.titulo, pageWidth / 2, 40, { align: 'center' });

  // Añadir datos del cliente, NIT y fecha de registro
  doc.setFontSize(opciones.tamanoFuente);
  doc.setFont('helvetica', 'bold');
  doc.text(`PROVEEDOR:`, margin, 50);
  doc.text(`ESTADO:`, margin, 57.5);
  doc.text(`FECHA DE REGISTRO:`, margin, 65);
  
  const rightAlignMargin = pageWidth - margin;

  doc.setFont('helvetica', 'normal'); // Fuente normal
  doc.text(`${pedido.proveedor}`, rightAlignMargin, 50, { align: 'right' });
  doc.text(`${pedido.estado}`, rightAlignMargin, 57.5, { align: 'right' });
  doc.text(`${formatDateTime(new Date(pedido.fecha_registro))}`, rightAlignMargin, 65, { align: 'right' });

  // Separar los productos en grupos de máximo 7 por página
  const productosGrupos = [];
  let productos = pedido.productos;

  // Agrupa los productos para la primera página con un máximo de 7 productos
  if (productos.length > maxProductosPrimeraPagina) {
    productosGrupos.push(productos.slice(0, maxProductosPrimeraPagina));
    productos = productos.slice(maxProductosPrimeraPagina);
  } else {
    productosGrupos.push(productos);
    productos = [];
  }

  // Agrupa los productos restantes para las páginas siguientes con un máximo de 10 productos por página
  while (productos.length > 0) {
    productosGrupos.push(productos.slice(0, maxProductosPorPagina));
    productos = productos.slice(maxProductosPorPagina);
  }

  productosGrupos.forEach((productos, index) => {
    // Si no es la primera página, añadir una nueva página
    if (index > 0) {
      doc.addPage();
      addHeader();
    }

    const tablaEncabezado = [[ 'Nombre', 'Tipo', 'Cantidad pedida']];
    const tablaDatos = productos.map(producto => [
      producto.nombre, producto.tipo, producto.cantidad_producto,
    ]);
    const startY = index === 0 ? 70 : 35;    

    const autoTableOptions = {
      startY: startY,
      margin: { horizontal: margin },
      tableWidth: 'auto',
      theme: 'grid',
      head: tablaEncabezado,
      body: tablaDatos,
      styles: {
        font: "helvetica",
        fillColor: '#ffffff',
        textColor: '#000000',
        fontSize: 12,
        lineColor: '#dddddd',
        lineWidth: 1,
        halign: 'center' // Alineación horizontal para todas las celdas
      },
      headStyles: {
        fillColor: '#cccccc',
        textColor: '#000000',
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'left' },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 25, halign: 'center' }, 
      }
    };
    

    // Dibujar la tabla en el PDF
    doc.autoTable(autoTableOptions);
  });

  // Añadir el precio total
  const finalY = doc.lastAutoTable.finalY || 25;
  doc.setFontSize(14);
  doc.text(`Total: ${pedido.precio_total.toFixed(2)} Bs`, pageWidth - margin, finalY + 20, { align: 'right' });

  // Añadir la firma
  const firmaX = pageWidth / 2;
  doc.line(firmaX - 30, finalY + 20, firmaX + 30, finalY + 20);
  doc.setFontSize(12);
  doc.text(opciones.firma, firmaX, finalY + 25, { align: 'center' });

  // Añadir números de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  // Guardar el PDF
  doc.save(opciones.nombreArchivo);
};