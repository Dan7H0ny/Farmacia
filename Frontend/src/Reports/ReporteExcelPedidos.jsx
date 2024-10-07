import React from 'react';
import { Button, Grid } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomActualizarUser from '../components/CustomActualizarUser';
import { DateRange, Approval, ProductionQuantityLimits } from '@mui/icons-material';

const ReporteExcelPedidos = ({ data, fileName, sheetName }) => {

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
        <CustomActualizarUser number={6} id="nombre" label="Nombre del Producto" type="text" icon={<ProductionQuantityLimits />} />
        <CustomActualizarUser number={6} id="categoria" label="Categoria del producto" type="text" icon={<Approval />} />
        <CustomActualizarUser number={6} id="fechaHoy" label="Fecha de Hoy" type="date" defaultValue={new Date().toISOString().split('T')[0]} readOnly={true} icon={<DateRange />} />
        <CustomActualizarUser number={6} id="fechaCaducidad" label="Fecha de caducidad" type="date" icon={<DateRange />} />
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
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value;
        const categoria = document.getElementById('categoria').value;
        const fechaHoy = document.getElementById('fechaHoy').value;
        const fechaCaducidad = document.getElementById('fechaCaducidad').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;

        return { nombre, categoria, fechaHoy, fechaCaducidad, fechaInicio, fechaFin };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombre, categoria, fechaHoy, fechaCaducidad, fechaInicio, fechaFin } = result.value;

        const DatosConFecha = data.filter(d => {
          const fechaRegistro = new Date(d.fecha_registro);
          const fechaCaducidad_ = new Date(d.fecha_caducidad);
          let matchFecha = true;
          let matchFechaCaducidad = true;
        
          // Aplicar el filtro de fechas solo si ambas están presentes
          if (fechaInicio && fechaFin) {
            matchFecha = fechaRegistro >= new Date(fechaInicio) && fechaRegistro <= new Date(fechaFin);
          } else if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
            // Mostrar un mensaje de validación y detener la ejecución si solo una fecha está definida
            Swal.showValidationMessage('Ambas fechas de inicio y fin son obligatorias para filtrar por fecha.');
            return false; 
          }

          if (fechaCaducidad) {
            matchFechaCaducidad = fechaCaducidad_ >= new Date(fechaHoy) && fechaCaducidad_ <= new Date(fechaCaducidad);
          } 
        
          const matchNombre = nombre ? (d.producto.nombre && d.producto.nombre.toLowerCase().includes(nombre.toLowerCase())) : true;
          const matchCategoria = categoria ? (d.categoria.nombre && d.categoria.nombre.toLowerCase().includes(categoria.toLowerCase())) : true;
        
          return matchNombre && matchCategoria && matchFecha && matchFechaCaducidad;
        });

        const DatosActualizados = DatosConFecha.map((item, index) => ({
          'N°': index + 1,
          'Nombre del producto': item.producto.nombre,
          'Proveedor del producto': item.producto.proveedor.nombre_marca,
          'Tipo de presentacion del producto': item.producto.tipo.nombre,
          'Capacidad de Presentacion del producto': item.producto.capacidad_presentacion,
          'Categoria del producto': item.categoria.nombre,
          'Precio de Venta del Producto': item.precioVenta,
          'Cantidad Actual del Producto': item.cantidad_stock,
          'Estado del almacen': item.estado ? 'Activo':'Inactivo',
          'Fecha de caducidad del producto': formatDateTime(new Date(item.fecha_caducidad)),
          'Usuario que registro': item.usuario_registro.nombre + ' ' + item.usuario_registro.apellido,
          'Usuario que actualizo': item.usuario_actualizacion.nombre + ' ' + item.usuario_actualizacion.apellido,
          'Fecha de Registro': formatDateTime(new Date(item.fecha_registro)),
          'Fecha de Actualización': formatDateTime(new Date(item.fecha_actualizacion)),
        }));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');

        // Agregar encabezados
        const headers = ["N°", "Nombre del producto", "Proveedor del producto", "Tipo de presentacion del producto", "Capacidad de Presentacion del producto", "Categoria del producto", 
        "Precio de Venta del Producto", "Cantidad Actual del Producto", "Estado del producto", "Fecha de caducidad del producto", "Usuario que registro", 
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

        // Ajustar el ancho de las columnas automáticamente
        worksheet.columns.forEach(column => {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, cell => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            if (cellLength > maxLength) maxLength = cellLength;
          });
          column.width = maxLength < 5 ? 5 : maxLength; // Ajustar el ancho mínimo si es necesario
        });

        // Ajustar la altura de las filas basado en el número de líneas de texto
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          let maxHeight = 30; // Altura base para las filas
          row.eachCell({ includeEmpty: true }, (cell) => {
            const value = cell.value ? cell.value.toString() : '';
            const lineCount = (value.match(/\n/g) || []).length + 1; // Contar el número de líneas
            const cellHeight = 30; // Altura por línea
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

export default ReporteExcelPedidos;
