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
        const DatosConFecha = data.filter(d => {
          const fechaRegistro = new Date(d.fecha_registro); 
          return fechaRegistro >= new Date(fechaInicio_) && fechaRegistro <= new Date(fechaFin_);
        });

        const DatosActualizados = DatosConFecha.map((item, index) => ({
          'N°': index + 1,
          'Nombre del Cliente': item.cliente.nombreCompleto,
          'Identificación': item.cliente.stringIdentity.nombre,
          'Número de Identificación': item.cliente.combinedIdentity,
          'Productos': item.productos.map(prod => `${prod.nombre} (${prod.cantidad_producto} unidades)`).join(', '),
          'Venta Total': item.precio_total,
          'Fecha de Registro': new Date(item.fecha_registro).toLocaleDateString('es-ES'),
          'Fecha de Actualización': new Date(item.fecha_actualizacion).toLocaleDateString('es-ES'),
          'Registrado Por': `${item.usuario_registra.nombre} ${item.usuario_registra.apellido}`,
          'Actualizado Por': `${item.usuario_update.nombre} ${item.usuario_update.apellido}`
        }));

        const ws = XLSX.utils.json_to_sheet(DatosActualizados, { origin: -1 });

        // Agregar encabezados personalizados
        const headers = ["N°", "Nombre del Cliente", "Identificación", "Número de Identificación", "Productos", "Venta Total", "Fecha de Registro", "Fecha de Actualización", "Registrado Por", "Actualizado Por"];
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

       // Aplicar estilos a los encabezados
      headers.forEach((header, index) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
        if (!ws[cellRef]) ws[cellRef] = {};
        ws[cellRef].s = {
          fill: { fgColor: { rgb: "FFFF00" } },
          font: { bold: true, color: { rgb: "000000" } },
          alignment: { horizontal: "center" }
        };
      });

      // Estilizar la columna 'N°'
      for (let row = 1; row <= data.length; row++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: 0 }); // Columna 'N°'
        if (!ws[cellRef]) ws[cellRef] = {};
        ws[cellRef].s = {
          fill: { fgColor: { rgb: "FF0000" } },
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center" }
        };
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
