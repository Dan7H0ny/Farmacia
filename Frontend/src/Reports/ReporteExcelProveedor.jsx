import React from 'react';
import { Button, Grid } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomActualizarUser from '../components/CustomActualizarUser';
import { DateRange, Person, Approval } from '@mui/icons-material';

const ReporteExcelUsuario = ({ data, fileName, sheetName }) => {

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
        <CustomActualizarUser number={6} id="marca" label="Marca" type="text" icon={<Approval />} />
        <CustomActualizarUser number={6} id="nombre" label="Nombre del Vendedor" type="text" icon={<Person />} />
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
        const marca = document.getElementById('marca').value;
        const nombre = document.getElementById('nombre').value;
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;

        return { marca, nombre, fechaInicio, fechaFin };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { marca, nombre, fechaInicio, fechaFin } = result.value;

        const DatosConFecha = data.filter(d => {
          const fechaRegistro = new Date(d.fecha_registro);
          let matchFecha = true;
        
          // Aplicar el filtro de fechas solo si ambas están presentes
          if (fechaInicio && fechaFin) {
            matchFecha = fechaRegistro >= new Date(fechaInicio) && fechaRegistro <= new Date(fechaFin);
          } else if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
            // Mostrar un mensaje de validación y detener la ejecución si solo una fecha está definida
            Swal.showValidationMessage('Ambas fechas son obligatorias para filtrar por fecha.');
            return false; 
          }
        
          const matchMarca = marca ? (d.nombre_marca && d.nombre_marca.toLowerCase().includes(marca.toLowerCase())) : true;
          const matchNombre = nombre ? (d.nombre_vendedor && d.nombre_vendedor.toLowerCase().includes(nombre.toLowerCase())) : true;
        
          return matchFecha && matchMarca && matchNombre;
        });        
      
        const DatosActualizados = DatosConFecha.map((item, index) => ({
          'N°': index + 1,
          'Nombre de la marca': item.nombre_marca,
          'Correo del Proveedor': item.correo ? item.correo :'s/n',
          'Telefono del Proveedor': item.telefono ? item.telefono :'s/n',
          'Sitio Web del Proveedor': item.sitioweb ? item.sitioweb : 's/n',
          'Nombre del Vendedor': item.nombre_vendedor,
          'Correo del Vendedor': item.correo_vendedor ? item.correo_vendedor : 's/n',
          'Celular del Vendedor': item.celular ? item.celular : 's/n',
          'Fecha de Registro': formatDateTime(new Date(item.fecha_registro)),
          'Fecha de Actualización': formatDateTime(new Date(item.fecha_actualizacion)),
        }));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');

        // Agregar encabezados
        const headers = ["N°", "Nombre de la marca", "Correo del Proveedor", "Telefono del Proveedor", "Sitio Web del Proveedor", "Nombre del Vendedor", "Correo del Vendedor", "Celular del Vendedor", "Fecha de Registro", "Fecha de Actualización"];
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

export default ReporteExcelUsuario;
