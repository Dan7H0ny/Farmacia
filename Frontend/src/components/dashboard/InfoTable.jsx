import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Box,
  IconButton
} from '@mui/material';
import { Search } from '@mui/icons-material';
import ReporteExcelPrediccion from '../../Reports/ReporteExcelPrediccion';
import CustomRegisterUser from '../CustomRegisterUser';
import Swal from 'sweetalert2';

const InfoTable = ({ predicciones, usuario }) => {
  const [searchTerm, setSearchTerm] = useState('');

  function formatDateTime(date) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
    return formattedDate;
  }

  // Filtra las predicciones basadas en el término de búsqueda
  const filteredPredicciones = predicciones.filter(prediccion =>
    prediccion.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prediccion.nombreCategoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prediccion.diaAgotamiento !== undefined && prediccion.diaAgotamiento !== null && prediccion.diaAgotamiento.toString().includes(searchTerm))
  );

  // Función para mostrar detalles en un Swal
  const showDetails = (prediccion) => {
    const startDate = new Date(prediccion.fecha);
    const ventas = prediccion.prediccion.ventas;

    // Construimos el contenido del Swal en formato de tabla
    const detailsContent = `
        <div style="max-height: 60vh; overflow-y: auto;"> <!-- Contenedor con scroll -->
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Día</th>
                        <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Fecha</th>
                        <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Ventas</th>
                    </tr>
                </thead>
                <tbody>
                    ${ventas.map((venta, dayIndex) => {
                        const date = new Date(startDate);
                        date.setDate(startDate.getDate() + dayIndex + 1); // +1 porque el día 0 es la fecha de registro
                        return `
                            <tr>
                                <td style="border: 1px solid #ccc; padding: 8px;">Día ${dayIndex + 1}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">${formatDateTime(date)}</td>
                                <td style="border: 1px solid #ccc; padding: 8px;">${venta}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;

    Swal.fire({
        title: `Detalles de ventas para ${prediccion.nombreProducto}`,
        html: detailsContent, // Usamos html para mostrar la tabla
        icon: 'info',
        confirmButtonText: 'Cerrar',
        width: '50%', // Ancho de la ventana del Swal
        height: '60%', // Altura de la ventana del Swal
        padding: '1em', // Espaciado interno
        background: '#0f1b35', // Color de fondo
        color: '#e2e2e2', // Color del texto
    });
  };

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#0f1b35', border: '2px solid #e2e2e2', boxSizing: 'border-box' }}>
      <Typography variant="h6" component="div" align="center" gutterBottom style={{ color: '#e2e2e2' }}>
        DATOS DE PREDICCIÓN
      </Typography>
      
      {/* Campo de búsqueda */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Grid container spacing={2}>
          <CustomRegisterUser
            number={8}
            label="Buscar"
            placeholder='Buscar por producto, categoria y fecha de caducidad'
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required={false}
            icon={<Search />}
          />
          <Grid item xs={12} sm={4} sx={{ '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
            <ReporteExcelPrediccion
              data={filteredPredicciones}
              firma_Usuario={usuario}
              fileName="Reporte de las predicciones"
              sheetName="Predicciones"
              sx={{
                backgroundColor: '#e2e2e2',
                color: '#0f1b35',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#1a7b13',
                  color: '#e2e2e2',
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead style={{ backgroundColor: '#0f1b35' }}>
            <TableRow>
              <TableCell style={headerCellStyle}>#</TableCell>
              <TableCell style={headerCellStyle}>Producto</TableCell>
              <TableCell style={headerCellStyle}>Categoría</TableCell>
              <TableCell style={headerCellStyle}>Datos Históricos</TableCell>
              <TableCell style={headerCellStyle}>Día Agotamiento</TableCell>
              <TableCell style={headerCellStyle}>Porcentaje de Error</TableCell>
              <TableCell style={headerCellStyle}>Fecha de registro</TableCell>
              <TableCell style={headerCellStyle}>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPredicciones.length > 0 ? (
              filteredPredicciones.map((prediccion, index) => (
                <TableRow key={index}>
                  <TableCell style={bodyCellStyle}>{index + 1}</TableCell>
                  <TableCell style={bodyCellStyle}>{prediccion.nombreProducto}</TableCell>
                  <TableCell style={bodyCellStyle}>{prediccion.nombreCategoria}</TableCell>
                  <TableCell style={bodyCellStyle}>{prediccion.datosHistoricos}</TableCell>
                  <TableCell style={bodyCellStyle}>{prediccion.diaAgotamiento ?? 'N/A'}</TableCell>
                  <TableCell style={bodyCellStyle}>{prediccion.porcentajeError.toFixed(2)}%</TableCell>
                  <TableCell style={bodyCellStyle}>{formatDateTime(new Date(prediccion.fecha))}</TableCell>
                  <TableCell style={bodyCellStyle}>
                    {prediccion.prediccion.ventas.every(venta => venta === 0) ? null : (
                      <IconButton onClick={() => showDetails(prediccion)} color="inherit">
                        <Search />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} style={bodyCellStyle} align="center">
                  No existen datos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// Define common styles for table header and body cells
const headerCellStyle = {
  color: '#e2e2e2',
  fontWeight: 'bold',
  border: '2px solid #e2e2e2',
  backgroundColor: '#0f1b35',
  textAlign: 'center'
};

const bodyCellStyle = {
  color: '#e2e2e2',
  border: '2px solid #e2e2e2',
  backgroundColor: '#0f1b35',
  textAlign: 'center'
};

export default InfoTable;

