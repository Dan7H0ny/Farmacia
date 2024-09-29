import React from 'react';
import { Button, Grid, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomActualizarUser from '../components/CustomActualizarUser';
import { DateRange } from '@mui/icons-material';

const ReporteExcelUsuario = ({ data, firma_Usuario, fileName, sheetName }) => {

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
        <CustomActualizarUser number={6} id="fechaInicio" label="Fecha de Inicio" type="date" icon={<DateRange />} />
        <CustomActualizarUser number={6} id="fechaFin" label="Fecha Fin" type="date" icon={<DateRange />} />
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Seleccione un rol para el usuario</Typography>
          <FormControlLabel
            control={
              <Checkbox
                id="rolAdministrador"
                color="primary"
              />
            }
            label="Administrador"
          />
          <FormControlLabel
            control={
              <Checkbox
                id="rolCajero"
                color="primary"
              />
            }
            label="Cajero"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Seleccione el estado</Typography>
          <FormControlLabel
            control={
              <Checkbox
                id='estadoActivo'
                color="primary"
              />
            }
            label="Activo"
          />
          <FormControlLabel
            control={
              <Checkbox
                id='estadoInactivo'
                color="primary"
              />
            }
            label="Inactivo"
          />
        </Grid>
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
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const rolAdministrador = document.getElementById('rolAdministrador').checked;
        const rolCajero = document.getElementById('rolCajero').checked;
        const estadoActivo = document.getElementById('estadoActivo').checked;
        const estadoInactivo = document.getElementById('estadoInactivo').checked;

        let rol = null;
        if (rolAdministrador && rolCajero) {
          Swal.showValidationMessage('Solo uno de los roles puede ser marcado');
          return false; // Prevenir la confirmación
        } else if (rolAdministrador) {
          rol = 'Administrador';
        } else if (rolCajero) {
          rol = 'Cajero';
        }

        let estado = undefined;
        if (estadoActivo && estadoInactivo) {
          Swal.showValidationMessage('Solo uno de los estados puede ser marcado');
          return false; // Prevenir la confirmación
        } else if (estadoActivo) {
          estado = true;
        } else if (estadoInactivo) {
          estado = false;
        }

        return { fechaInicio, fechaFin, rol, estado };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { fechaInicio, fechaFin, rol, estado } = result.value;

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
        
          const matchRol = rol ? d.rol.toLowerCase() === rol.toLowerCase() : true;
          const matchEstado = estado !== undefined ? d.estado === estado : true;
        
          return matchFecha && matchRol && matchEstado;
        });        

        const DatosActualizados = DatosConFecha.map((item, index) => ({
          'N°': index + 1,
          'Nombre del Usuario': item.nombre,
          'Apellido del Usuario': item.apellido,
          'Correo del Usuario': item.correo,
          'Carnet de identidad del Usuario': item.carnetIdentidad,
          'Direccion del Usuario': item.direccion ? item.direccion : 's/n',
          'Rol del Usuario': item.rol,
          'Telefono del Usuario': item.telefono ? item.telefono : 's/n',
          'Estado del Usuario': item.estado ? 'Activo' : 'Inactivo',
          'Fecha de Registro': formatDateTime(new Date(item.fecha_registro)),
          'Fecha de Actualización': formatDateTime(new Date(item.fecha_actualizacion)),
        }));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');

        // Agregar encabezados
        const headers = ["N°", "Nombre del Usuario", "Apellido del Usuario", "Correo del Usuario", "Carnet de identidad del Usuario", "Direccion del Usuario", "Rol del Usuario", "Telefono del Usuario", "Estado del Usuario", "Fecha de Registro", "Fecha de Actualización"];
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
        const filaImpresion = worksheet.addRow([fechaImpresion, "", "", "", "", "", firmaUsuario]);

        // Combinar las celdas A-F para "Fecha de impresión"
        worksheet.mergeCells(`A${filaImpresion.number}:F${filaImpresion.number}`);

        // Combinar las celdas G-K para "Firma del usuario"
        worksheet.mergeCells(`G${filaImpresion.number}:K${filaImpresion.number}`);

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

export default ReporteExcelUsuario;
