import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportExcelButton = ({ data, fileName, sheetName }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data, { origin: -1 }); // Permite encabezados personalizados

    // Establecer encabezados personalizados y estilos
    const headers = ["N°", "NombreCliente", "Identificacion", "NumeroIdentificacion", "Productos", "TotalVenta", "FechaRegistro", "FechaActualizacion", "UsuarioRegistro", "UsuarioUpdate"];
    const headerRange = XLSX.utils.decode_range(ws['!ref']);
    headerRange.s.r = 0; // start in the first row
    headerRange.e.r = 0; // end in the first row

    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    // Aplicar estilos a los encabezados
    headers.forEach((h, i) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      ws[cellRef].s = {
        fill: { fgColor: { rgb: "FFFF00" } }, // Color de fondo
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

    // Ajustar los estilos de las celdas de datos
    for (let R = headerRange.e.r + 1; R <= ws['!ref'].split(':')[1].slice(1); ++R) {
      for (let C = 0; C < headers.length; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[cellRef]) {
          ws[cellRef].s = {
            alignment: { horizontal: "left", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          };
        }
      }
    }

    // Crear libro y añadir hoja
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');

    // Escribir el archivo
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `${fileName}.xlsx`);
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
      onClick={exportToExcel}
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
