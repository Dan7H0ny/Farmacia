import React from 'react';
import { Button, Grid } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomActualizarUser from '../components/CustomActualizarUser';
import {Numbers, ProductionQuantityLimits, Category, WarningAmber, Inventory, CalendarToday } from '@mui/icons-material';

const ReporteExcelPrediccion = ({ data, firma_Usuario, fileName, sheetName }) => {

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
        <CustomActualizarUser number={12} id="nombreProducto" label="Nombre del Producto" type="text" icon={<ProductionQuantityLimits />} />
        <CustomActualizarUser number={8} id="nombreCategoria" label="Categoría del Producto" type="text" icon={<Category />} />
        <CustomActualizarUser number={4} id="porcentajeError" label="Porcentaje minimo de error" type="Number" icon={<WarningAmber />} 
          onKeyPress={(e) => {
            // Permitir solo números y un punto decimal
            const isNumberOrPoint = /[0-9.]$/.test(e.key);
            if (!isNumberOrPoint) {
              e.preventDefault();
            }
            
            // Validar que solo haya un punto decimal
            const currentValue = e.target.value;
            if (e.key === '.' && currentValue.includes('.')) {
              e.preventDefault();
            }
          }}/>
        <CustomActualizarUser number={6} id="ventasMin" label="Ventas Mínimas" type="Number" icon={<Numbers />} onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}/>
        <CustomActualizarUser number={6} id="ventasMax" label="Ventas Máximas" type="Number" icon={<Numbers />} onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}/>
        <CustomActualizarUser number={6} id="stockRestante" label="Stock Restante en el Almacen" type="Number" icon={<Inventory />}  onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}/>
        <CustomActualizarUser number={6} id="diaAgotamiento" label="Dia de agotamiento" type="Number" icon={<CalendarToday />}  onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}/>
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
      preConfirm: () => {
        const nombreProducto = document.getElementById('nombreProducto').value;
        const nombreCategoria = document.getElementById('nombreCategoria').value;
        const porcentajeError = document.getElementById('porcentajeError').value;
        const ventasMin = document.getElementById('ventasMin').value;
        const ventasMax = document.getElementById('ventasMax').value;
        const stockRestante = document.getElementById('stockRestante').value;
        const diaAgotamiento = document.getElementById('diaAgotamiento').value;
        if (porcentajeError !== '') {
          const porcentajeErrorFloat = parseFloat(porcentajeError);
        
          // Validar que sea un número decimal con exactamente un punto decimal y máximo 2 decimales
          if (!/^\d{1,2}\.\d{1,2}$/.test(porcentajeError) || porcentajeErrorFloat > 100 || porcentajeErrorFloat < 0) {
            Swal.showValidationMessage('<div class="custom-validation-message">El porcentaje debe ser un número decimal con máximo 2 decimales, y debe estar entre 0 y 100.</div>');
            return false;
          }
        }
        
        if (ventasMin !== '') {
          const ventasMin_ = parseInt(ventasMin);
          // Validar el formato para que solo acepte números enteros
          if (!/^\d+$/.test(ventasMin) || ventasMin_ < 0) {
            Swal.showValidationMessage('<div class="custom-validation-message">El valor minimo debe ser un número entero mayor o igual a 0.</div>');
            return false;
          }
        }
        if (ventasMax !== '') {
          const ventasMax_ = parseInt(ventasMax);
          // Validar el formato para que solo acepte números enteros
          if (!/^\d+$/.test(ventasMax) || ventasMax_ < 0) {
            Swal.showValidationMessage('<div class="custom-validation-message">El valor maximo debe ser un número entero mayor o igual a 0.</div>');
            return false;
          }
        }
        if (stockRestante !== '') {
          const stockRestante_ = parseInt(stockRestante);
          // Validar el formato para que solo acepte números enteros
          if (!/^\d+$/.test(stockRestante) || stockRestante_ < 0) {
            Swal.showValidationMessage('<div class="custom-validation-message">Elstock debe ser un número entero mayor o igual a 0.</div>');
            return false;
          }
        }
        if (diaAgotamiento !== '') {
          const diaAgotamiento_ = parseInt(diaAgotamiento);
          // Validar el formato para que solo acepte números enteros
          if (!/^\d+$/.test(diaAgotamiento) || diaAgotamiento_ < 0) {
            Swal.showValidationMessage('<div class="custom-validation-message">El dia de agotamiento debe ser un número entero mayor o igual a 0.</div>');
            return false;
          }
        }           

        return { nombreProducto, nombreCategoria, porcentajeError, ventasMin, ventasMax, stockRestante, diaAgotamiento };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombreProducto, nombreCategoria, porcentajeError, ventasMin, ventasMax, stockRestante, diaAgotamiento } = result.value;
        const DatosConFecha = data.filter(d => {

          const sumaVentas = d.prediccion.ventas.reduce((acc, venta) => acc + venta, 0);

          const matchNombreProducto = nombreProducto ? (d.nombreProducto && d.nombreProducto.toLowerCase().includes(nombreProducto.toLowerCase())) : true;
          const matchNombreCategoria = nombreCategoria ? (d.nombreCategoria && d.nombreCategoria.toLowerCase().includes(nombreCategoria.toLowerCase())) : true;
          const matchPorcentajeError = porcentajeError ? d.porcentajeError <= parseFloat(porcentajeError) : true;
          const matchVentasMin = ventasMin ? sumaVentas >= parseFloat(ventasMin) : true;
          const matchVentasMax = ventasMax ? sumaVentas <= parseFloat(ventasMax) : true;
          const matchStockRestante = stockRestante ? d.prediccion.stockRestante <= parseFloat(stockRestante) : true;
          const matchDiaAgotamiento = diaAgotamiento ? d.diaAgotamiento <= parseInt(diaAgotamiento) : true;
        
          return matchNombreProducto && matchNombreCategoria && matchPorcentajeError && matchVentasMin && matchVentasMax && matchStockRestante && matchDiaAgotamiento;
        });
        
        const DatosActualizados = DatosConFecha.map((item, index) => ({
          'N°': index + 1,
          'Nombre del Producto': item.nombreProducto,
          'Categoría del Producto': item.nombreCategoria,
          'Porcentaje de Error': item.porcentajeError,
          'Ventas': item.prediccion.ventas,
          'Stock Restante': item.prediccion.stockRestante,
          'Día de Agotamiento': item.diaAgotamiento,
        }));
        

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');

        // Agregar encabezados
        const headers = ["N°", "Nombre del Producto", "Categoría del Producto", "Porcentaje de Error", "Ventas", "Stock Restante", "Día de Agotamiento"];
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

        // Ajustar el ancho de las columnas automáticamente
        worksheet.columns.forEach(column => {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, cell => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            if (cellLength > maxLength) maxLength = cellLength;
          });
          column.width = maxLength < 10 ? 10 : maxLength; // Ajustar el ancho mínimo si es necesario
        });

        // Agregar una fila en blanco
        worksheet.addRow([]);

        // Agregar una fila con "Fecha de impresión" y "Firma del usuario"
        const fechaImpresion = `Fecha de impresión: ${formatDateTime(new Date())}`;
        const firmaUsuario = `Firma del ${firma_Usuario.nombre} ${firma_Usuario.apellido}:________________________`;

        // Agregar la fila con los valores, asegurando que las celdas intermedias estén vacías
        const filaImpresion = worksheet.addRow([fechaImpresion, "", "", "", firmaUsuario]);

        // Combinar las celdas A-F para "Fecha de impresión"
        worksheet.mergeCells(`A${filaImpresion.number}:D${filaImpresion.number}`);

        // Combinar las celdas G-K para "Firma del usuario"
        worksheet.mergeCells(`E${filaImpresion.number}:G${filaImpresion.number}`);

        // Estilos para la fila de impresión y firma
        filaImpresion.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.font = { bold: true }; // Texto en negrita
          cell.alignment = { horizontal: 'left', vertical: 'middle' }; // Alinear el texto a la izquierda y centrado verticalmente
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
        });

        // Ajustar la altura de las filas basado en el número de líneas de texto
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          let maxHeight = 30; // Altura base para las filas
          row.eachCell({ includeEmpty: true }, (cell) => {
            const value = cell.value ? cell.value.toString() : '';
            const lineCount = (value.match(/\n/g) || []).length + 1; // Contar el número de líneas
            const cellHeight = 20; // Altura por línea
            const requiredHeight = cellHeight * lineCount;

            // Ajustar la altura máxima si es necesario
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

export default ReporteExcelPrediccion;
