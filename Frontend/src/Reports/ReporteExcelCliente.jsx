import React,{useRef,useMemo,useEffect,useState} from 'react';
import axios from 'axios';
import { Button, Grid } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomActualizarUser from '../components/CustomActualizarUser';
import CustomSelectC from '../components/CustomSelectC';
import CustomSwal from '../components/CustomSwal';
import {Person, Badge, Numbers, DateRange, Extension } from '@mui/icons-material';

const ReporteExcelCliente = ({ data, fileName, sheetName }) => {
  const [ complementos, setComplementos ] = useState([]);
  const identidadSelect = useRef();
  const UrlReact = process.env.REACT_APP_CONEXION_BACKEND;
  const obtenerToken = () => { const token = localStorage.getItem('token'); return token;}; 
  const token = obtenerToken();
  const configInicial = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  useEffect(() => {
    const nombre = 'Identificación'
    axios.get(`${UrlReact}/complemento/buscarNombre/${nombre}`, configInicial)
      .then(response => {
        if (!token) {
          CustomSwal({ icono: 'error', titulo: 'El token es invalido', mensaje: 'Error al obtener el token de acceso'});
        }
        else {setComplementos(response);}
      })
      .catch(error => { console.log(error);});
  }, [token, configInicial, UrlReact]);

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
        <CustomActualizarUser number={12} id="nombreCompleto" label="Nombre Completo" type="text" required={true} icon={<Person />} />
        <CustomActualizarUser number={8} id="combinatedIdentity" label="Numero de Identidad" type="number" icon={<Numbers />}  onKeyPress={(e) => {if (!/[0-9]/.test(e.key)) {e.preventDefault();}}}/>
        <CustomActualizarUser number={4} id="extension" label="Extension" type="text" required={false} icon={<Extension />} />
        <CustomSelectC number={12} id="identidad-select" label="Seleccione la identidad del cliente" value={''} roles={complementos} ref={identidadSelect} icon={<Badge />}/>
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
        const nombreCompleto = document.getElementById('nombreCompleto').value;
        const combinatedIdentity = parseInt(document.getElementById('combinatedIdentity').value);
        const extension = document.getElementById('extension').value;
        const stringIdentity = identidadSelect.current.getRoleName();
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const TipoIdentidad = stringIdentity ? stringIdentity : false;

        return { nombreCompleto, combinatedIdentity, extension, TipoIdentidad, fechaInicio, fechaFin };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombreCompleto, combinatedIdentity, extension, TipoIdentidad, fechaInicio, fechaFin } = result.value;
        const identidad = combinatedIdentity ? combinatedIdentity.toString() : false;

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

          const matchNombreCompleto = nombreCompleto ? (d.nombreCompleto && d.nombreCompleto.toLowerCase().includes(nombreCompleto.toLowerCase())) : true;
          const matchCombinadoIdentidad = identidad ? (d.combinedIdentity && d.combinedIdentity.toLowerCase().includes(identidad.toLowerCase())) : true;
          const matchExtension = extension ? (d.extension && d.extension.toLowerCase().includes(extension.toLowerCase())) : true;
          const matchString = TipoIdentidad ? (d.stringIdentity.nombre && d.stringIdentity.nombre.toLowerCase().includes(TipoIdentidad.toLowerCase())) : true;
        
          return matchFecha && matchNombreCompleto && matchExtension && matchCombinadoIdentidad && matchString;
        });        

        const DatosActualizados = DatosConFecha.map((item, index) => ({
          'N°': index + 1,
          'Nombre del Cliente': item.nombreCompleto,
          'Correo del Cliente': item.correo ? item.correo : 's/n',
          'Telefono del Cliente': item.telefono ? item.telefono : 's/n',
          'Número de Identidad': item.combinedIdentity,
          'Extensión': item.extension ? item.extension : 's/n',
          'Tipo de Identidad': item.stringIdentity.nombre,
          'Usuario que Registró': item.usuario_registro.nombre + ' ' + item.usuario_registro.apellido,
          'Usuario que Actualizó': item.usuario_actualizacion.nombre + ' ' + item.usuario_actualizacion.apellido,
          'Fecha de Registro': formatDateTime(new Date(item.fecha_registro)),
          'Fecha de Actualización': formatDateTime(new Date(item.fecha_actualizacion)),
        }));

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName || 'Sheet1');

        // Agregar encabezados
        const headers = ["N°", "Nombre del Cliente", "Correo del Cliente", "Telefono del Cliente", "Número de Identidad", "Extensión", "Tipo de Identidad", "Usuario que Registró", "Usuario que Actualizó", "Fecha de Registro", "Fecha de Actualización"];
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

export default ReporteExcelCliente;
