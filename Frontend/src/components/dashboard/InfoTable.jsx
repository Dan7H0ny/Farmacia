import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const InfoTable = ({ predicciones }) => {
  return (
    <Paper style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#0f1b35' }}>
      <Typography variant="h6" component="div" align="center" gutterBottom style={{ color: '#e2e2e2' }}>
        DATOS DE PREDICCIÓN
      </Typography>
      <TableContainer 
        component={Paper} 
        style={{ maxHeight: 400, overflowY: 'auto' }} // Enable scroll on y-axis if needed
      >
        <Table stickyHeader>
          <TableHead style={{ backgroundColor: '#0f1b35' }}>
            <TableRow>
              <TableCell style={headerCellStyle}>#</TableCell>
              <TableCell style={headerCellStyle}>Producto</TableCell>
              <TableCell style={headerCellStyle}>Categoría</TableCell>
              <TableCell style={headerCellStyle}>Ventas</TableCell>
              <TableCell style={headerCellStyle}>Datos Historicos</TableCell>
              <TableCell style={headerCellStyle}>Día Agotamiento</TableCell>
              <TableCell style={headerCellStyle}>Porcentaje de Error</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predicciones.map((prediccion, index) => (
              <TableRow key={index}>
                <TableCell style={bodyCellStyle}>{index + 1}</TableCell>
                <TableCell style={bodyCellStyle}>{prediccion.nombreProducto}</TableCell>
                <TableCell style={bodyCellStyle}>{prediccion.nombreCategoria}</TableCell>
                <TableCell style={bodyCellStyle}>{prediccion.prediccion.ventas.join(', ')}</TableCell>
                <TableCell style={bodyCellStyle}>{prediccion.datosHistoricos}</TableCell>
                <TableCell style={bodyCellStyle}>{prediccion.diaAgotamiento ?? 'N/A'}</TableCell>
                <TableCell style={bodyCellStyle}>{prediccion.porcentajeError.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
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