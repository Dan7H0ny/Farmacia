import React from 'react';
import { Button, Grid } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomActualizarUser from '../components/CustomActualizarUser';
import { DateRange, ProductionQuantityLimits, Person, AttachMoney, AddBusiness } from '@mui/icons-material';

const ReporteExcelVenta = ({ data, fileName, sheetName }) => {

  const btnImprimir = () => {

    function formatDateTime(date) {
      const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
      const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);
      return `${formattedDate} ${formattedTime}`;
    }

    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(
      <Grid container spacing={2}>
        <CustomActualizarUser number={12} id="nombreCliente" label="Nombre del Cliente" type="text" icon={<Person />} />
        <CustomActualizarUser number={6} id="nombreProducto" label="Nombre del Producto" type="text" icon={<ProductionQuantityLimits />} />
        <CustomActualizarUser number={6} id="nombreProveedor" label="Nombre del Proveedor" type="text" icon={<AddBusiness />} />
        <CustomActualizarUser number={6} id="precioMinimo" label="Precio Minimo Total" type="number" icon={<AttachMoney />} />
        <CustomActualizarUser number={6} id="precioMaximo" label="Precio Maximo Total" type="number" icon={<AttachMoney />} />
        <CustomActualizarUser number={6} id="fechaInicio" label="Fecha de Inicio" type="date" icon={<DateRange />} />
        <CustomActualizarUser number={6} id="fechaFin" label="Fecha Fin" type="date" icon={<DateRange />} />
      </Grid>
    );

    Swal.fire({
      title: 'FILTROS DE LOS REPORTES',
      html: container,
      confirmButtonText: 'Imprimir',
      customClass: {
        popup: 'customs-swal-popup',
        title: 'customs-swal-title',
        confirmButton: 'swal2-confirm custom-swal2-confirm',
        cancelButton: 'swal2-cancel custom-swal2-cancel',
      },
      didOpen: () => {
        setTimeout(() => {
          const precioInputMin = document.getElementById('precioMinimo');
          const precioInputMax = document.getElementById('precioMaximo');

          precioInputMin.addEventListener('input', function () {
            let value = parseFloat(this.value);
            if (isNaN(value) || value < 0) {
              this.value = null;
            } else {
              this.value = value.toFixed(2);
            }
            
            // Verificar y ajustar el valor del precio máximo si es necesario
            let maxValue = parseFloat(precioInputMax.value);
            if (!isNaN(maxValue) && maxValue <= value) {
              precioInputMax.value = (value + 0.01).toFixed(2);
            }
          });
      
          precioInputMax.addEventListener('input', function () {
            let value = parseFloat(this.value);
            let minValue = parseFloat(precioInputMin.value);
          
            // Si precioMinimo no tiene valor, asumimos que su valor es 0
            if (isNaN(minValue)) {
              minValue = 0;
            }
          
            if (isNaN(value) || value <= minValue || value <= 0) {
              // Aseguramos que el valor mínimo del precio máximo sea 0.01 y que sea mayor que precioMinimo
              this.value = (Math.max(minValue + 0.01, 0.01)).toFixed(2);
            } else {
              this.value = value.toFixed(2);
            }
          });
          
        }, 0);
      },
      preConfirm: () => {
        const nombreCliente = document.getElementById('nombreCliente').value;
        const nombreProducto = document.getElementById('nombreProducto').value;
        const nombreProveedor = document.getElementById('nombreProveedor').value;
        const precioMinimo = parseFloat(document.getElementById('precioMinimo').value);
        const precioMaximo = parseFloat(document.getElementById('precioMaximo').value);
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
    
        return { nombreCliente, nombreProducto, nombreProveedor, precioMinimo, precioMaximo, fechaInicio, fechaFin };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombreCliente, nombreProducto, nombreProveedor, precioMinimo, precioMaximo, fechaInicio, fechaFin } = result.value;

        const DatosConFecha = data.filter(d => {
          const fechaRegistro = new Date(d.fecha_registro);
          const precioTotal = d.precio_total;
          let matchFecha = true;
          let matchPrecio = true;
          let matchNombreProducto = true;
          let matchNombreProveedor = true;
        
          // Aplicar el filtro de fechas solo si ambas están presentes
          if (fechaInicio && fechaFin) {
            matchFecha = fechaRegistro >= new Date(fechaInicio) && fechaRegistro <= new Date(fechaFin);
          } else if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
            // Mostrar un mensaje de validación y detener la ejecución si solo una fecha está definida
            Swal.showValidationMessage('Ambas fechas de inicio y fin son obligatorias para filtrar por fecha.');
            return false; 
          }
          if (precioMinimo && precioMaximo) {
            matchPrecio = precioTotal >= precioMinimo && precioTotal <= precioMaximo;
          } else if ((precioMinimo && !precioMaximo) || (!precioMinimo && precioMaximo)) {
            // Mostrar mensaje de validación y detener la ejecución si solo un precio está definido
            Swal.showValidationMessage('Ambos precios mínimos y máximos son necesarios para filtrar por precio.');
            return false;
          }
        
          const matchNombreCliente = nombreCliente ? (d.cliente.nombreCompleto && d.cliente.nombreCompleto.toLowerCase().includes(nombreCliente.toLowerCase())) : true;

          if (nombreProducto) {
            matchNombreProducto = d.productos.some(productoItem => 
              productoItem.nombre.toLowerCase().includes(nombreProducto.toLowerCase())
            );
          }
          if (nombreProveedor) {
            matchNombreProveedor = d.productos.some(productoItem => 
              productoItem.proveedor.toLowerCase().includes(nombreProveedor.toLowerCase())
            );
          }
        
          return matchFecha && matchPrecio && matchNombreCliente && matchNombreProducto && matchNombreProveedor;
        });

        const DatosActualizados = DatosConFecha.map((item, index) => ({
          'N°': index + 1,
          'Datos del cliente del producto': `Nombre: ${item.cliente.nombreCompleto}\n${item.cliente.stringIdentity?.nombre}: ${item.cliente.numberIdentity}`,
          'Nombre de los Productos': item.productos.map(producto => producto.nombre).join('\n'),
          'Proveedores de los Productos': item.productos.map(producto => producto.proveedor).join('\n'),
          'Cantidad pedida': item.productos.map(producto => producto.cantidad_producto).join('\n'),
          'Precio Parcial': item.productos.map(producto => producto.precio_venta).join('\n'),
          'Precio Total': item.precio_total,
          'Usuario que registro': item.usuario_registra.nombre + ' ' + item.usuario_registra.apellido,
          'Usuario que actualizo': item.usuario_update.nombre + ' ' + item.usuario_update.apellido,
          'Fecha de Registro': formatDateTime(new Date(item.fecha_registro)),
          'Fecha de Actualización': formatDateTime(new Date(item.fecha_actualizacion)),
        }));
        

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');

        // Agregar encabezados
        const headers = ["N°", "Datos del cliente del producto", "Nombre de los Productos", "Proveedores de los Productos", "Cantidad pedida", "Precio Parcial", "Precio Total", "Usuario que registro", 
        "Usuario que actualizo", "Fecha de Registro", "Fecha de Actualización"];
        
        worksheet.addRow(headers).eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.font = { bold: true, color: { argb: 'e2e2e2' } };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '0f1b35' }
          };
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
        });

        // Agregar datos
        DatosActualizados.forEach((data) => {
          worksheet.addRow(Object.values(data)).eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = {
              top: { style: 'thin', color: { argb: '000000' } },
              left: { style: 'thin', color: { argb: '000000' } },
              bottom: { style: 'thin', color: { argb: '000000' } },
              right: { style: 'thin', color: { argb: '000000' } }
            };
          });
        });

        const paddingVertical = 1; // Padding vertical (arriba y abajo)
        const baseCellHeight = 20; // Altura base para las filas

        // Definir el ancho estático para cada columna basado en los encabezados
        const headerWidths = {
          0: 5,  
          1: 30,  
          2: 25,  
          3: 45,
          4: 15,
          5: 12,
          6: 11,
          7: 18,
          8: 19,
          9: 16,
          10:20, 
        };
        
        // Ajustar el ancho de las columnas basado en los índices
        worksheet.columns.forEach((column, index) => {
          // Obtener el ancho estático para la columna basado en el índice
          const headerWidth = headerWidths[index] || 15; // Valor por defecto si el índice no está en headerWidths
          
          // Establecer el ancho de la columna estático
          column.width = headerWidth;
        });

        // Ajustar la altura de las filas basado en el número de líneas de texto con padding
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          let maxHeight = baseCellHeight; // Altura base para las filas
          row.eachCell({ includeEmpty: true }, (cell) => {
            const value = cell.value ? cell.value.toString() : '';
            const lineCount = (value.match(/\n/g) || []).length + 1; // Contar el número de líneas
            const cellHeight = baseCellHeight; // Altura por línea

            // Calcular la altura requerida para la celda actual
            const requiredHeight = cellHeight * lineCount + (2 * paddingVertical);
            if (requiredHeight > maxHeight) {
              maxHeight = requiredHeight;
            }
          });
          row.height = maxHeight;
        });      

        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: "application/octet-stream" }), `${fileName}.xlsx`);
        });
      }
    });
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      onClick={btnImprimir}
      sx={{
        backgroundColor: '#e2e2e2',
        color: '#0f1b35',
        border: '2px solid #0f1b35',
        marginTop: 2.5,
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#1a7b13',
          color: '#e2e2e2',
          border: '2px solid #0f1b35',
        },
      }}
    >
      GENERAR REPORTE
    </Button>
  );
};

export default ReporteExcelVenta;
