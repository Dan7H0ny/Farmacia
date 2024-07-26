import React from 'react';
import { Button, Grid } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CustomActualizarUser from './CustomActualizarUser';
import DateRange from '@mui/icons-material/DateRange';

const ExportExcelButton = ({ data, fileName, sheetName }) => {
  const btnImprimir = () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(
      <Grid container spacing={2}>
        <CustomActualizarUser number={6} id="fechaInicio" label="Fecha de Inicio" type="date" required={true} icon={<DateRange />} />
        <CustomActualizarUser number={6} id="fechaFin" label="Fecha de Finalizacion" type="date" required={true} icon={<DateRange />} />
      </Grid>
    );

    Swal.fire({
      title: 'SELECCIONE LAS FECHAS DE REPORTE',
      html: container,
      confirmButtonText: 'Imprimir',
      customClass: {
        popup: 'customs-swal-popup',
        title: 'customs-swal-title',
        confirmButton: 'swal2-confirm custom-swal2-confirm',
        cancelButton: 'swal2-cancel custom-swal2-cancel',
      },
      preConfirm: () => {
        const fechaInicio_ = document.getElementById('fechaInicio').value;
        const fechaFin_ = document.getElementById('fechaFin').value;
        if (!fechaInicio_ || !fechaFin_) {
          Swal.showValidationMessage('Ambas fechas son obligatorias');
          return false;
        }
        return { fechaInicio_, fechaFin_ };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { fechaInicio_, fechaFin_ } = result.value;

        // Filtrar los datos basados en las fechas proporcionadas
        const filteredData = data.filter(d => {
          const fechaRegistro = new Date(d.FechaRegistro);
          return fechaRegistro >= new Date(fechaInicio_) && fechaRegistro <= new Date(fechaFin_);
        });

        const datosConNumeros = filteredData.map((item, index) => ({
          'N°': index + 1,
          ...item
        }));

        // Convertir datos JSON a hoja de Excel
        const ws = XLSX.utils.json_to_sheet(datosConNumeros);

        // Definir encabezados personalizados y su estilo
        const headers = ["N°", "NombreCliente", "Identificacion", "NumeroIdentificacion", "Productos", "TotalVenta", "FechaRegistro", "FechaActualizacion", "UsuarioRegistro", "UsuarioUpdate"];
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

        // Aplicar estilos a los encabezados
        headers.forEach((header, colIdx) => {
          const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
          if (!ws[cellRef]) ws[cellRef] = {};
          ws[cellRef].s = {
            fill: { fgColor: { rgb: "FFFF00" } }, // Color de fondo amarillo
            font: { bold: true, sz: 12, name: 'Calibri', color: { rgb: "000000" } }, // Texto en negrita
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          };
        });

        const range = XLSX.utils.decode_range(ws['!ref']);
        range.s.r = 0; // Ajustar para incluir los encabezados

        for (let row = 1; row <= range.e.r; ++row) {
          for (let col = 0; col <= range.e.c; ++col) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            if (!ws[cellRef]) ws[cellRef] = {};
            ws[cellRef].s = {
              alignment: { horizontal: "left", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
              }
            };
            // Aplicar formato de fecha a las celdas que contienen fechas
            if (headers[col] === "FechaRegistro" || headers[col] === "FechaActualizacion") {
              ws[cellRef].z = 'dd/mm/yyyy'; // Formato de fecha
            }
          }
        }

        // Ajustar el ancho de las columnas
        const colWidths = [
          { wch: 5 },  // N°
          { wch: 25 }, // NombreCliente
          { wch: 20 }, // Identificacion
          { wch: 20 }, // NumeroIdentificacion
          { wch: 40 }, // Productos
          { wch: 15 }, // TotalVenta
          { wch: 20 }, // FechaRegistro
          { wch: 20 }, // FechaActualizacion
          { wch: 30 }, // UsuarioRegistro
          { wch: 30 }  // UsuarioUpdate
        ];
        ws['!cols'] = colWidths;

        // Crear el libro y añadir la hoja de trabajo
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');

        // Escribir el archivo y guardarlo
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `${fileName}.xlsx`);
      }
    });
  };

  // Convertir cadena a ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

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

export default ExportExcelButton;
