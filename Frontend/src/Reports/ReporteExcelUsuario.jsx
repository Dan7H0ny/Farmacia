import React from 'react';
import { Button, Grid, Switch } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomSelectUser from '../components/CustomSelectUser';
import { DateRange, People } from '@mui/icons-material';
import styled from 'styled-components';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#e2e2e2',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#e2e2e2',
  },
}));

const ReporteExcelUsuario = ({ data, fileName, sheetName }) => {

  const btnImprimir = () => {
    const roles = [{ nombre: 'Administrador' }, { nombre: 'Cajero' }];

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
        <CustomSelectUser number={6} id="rol" label="Seleccione un rol para el usuario" value={''} roles={roles} icon={<People />} />
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <label htmlFor="estado" style={{ marginRight: '10px' }}>Estado:</label>
          <CustomSwitch 
            onChange={(event, checked) => document.getElementById('estado').checked = checked} 
            color="primary"
          />
          <input type="checkbox" id="estado" hidden />
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
        const rol = document.getElementById('rol').textContent;
        const estado = document.getElementById('estado').checked;

        return { fechaInicio, fechaFin, rol, estado };
      }
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
          'Direccion del Usuario': item.direccion,
          'Rol del Usuario': item.rol,
          'Telefono del Usuario': item.telefono,
          'Estado del Usuario': item.estado ? 'Activo' : 'Inactivo',
          'Fecha de Registro': formatDateTime(new Date(item.fecha_registro)),
          'Fecha de Actualización': formatDateTime(new Date(item.fecha_actualizacion)),
        }));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');

        // Agregar encabezados
        const headers = ["N°", "Nombre del Usuario", "Apellido del Usuario", "Correo del Usuario", "Direccion del Usuario", "Rol del Usuario", "Telefono del Usuario", "Estado del Usuario", "Fecha de Registro", "Fecha de Actualización"];
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
