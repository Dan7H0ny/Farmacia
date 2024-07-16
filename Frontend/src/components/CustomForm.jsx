import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Grid, TablePagination, Button, Box } from '@mui/material';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import '../assets/css/tabla.css';

const CustomForm = ({ productos, buscar, btnAñadir }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filtrarDatos = productos.filter(elemento => {
    const { nombre, proveedor, tipo } = elemento;
    const busqueda = buscar.toLowerCase();
    return (
      nombre.toLowerCase().includes(busqueda) ||
      proveedor.nombre_marca.toLowerCase().includes(busqueda) ||
      tipo.nombre.toLowerCase().includes(busqueda) 
    );
  });

  const paginaDatos = filtrarDatos.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  const createTransposedData = () => {
    const headers = ["Producto", "Proveedor", "Presentacion", "Capacidad", "Precio", "Añadir"];
    const transposedData = headers.map((header) => [header, ...paginaDatos.map(row => {
      switch (header) {
        case "Producto":
          return row.nombre;
        case "Proveedor":
          return row.proveedor.nombre_marca;
        case "Presentacion":
          return row.tipo.nombre;
        case "Capacidad":
          return row.capacidad_presentacion;
        case "Precio":
          return row.precioCompra;
        case "Añadir":
          return (
            <Button variant="contained" color="success" onClick={() => btnAñadir(row)} sx={{backgroundColor: "#0f1b35", color:" #e2e2e2", border: '2px solid #e2e2e2'}}>
              <AddCircleOutlineOutlined  />
            </Button>
          );
        default:
          return null;
      }
    })]);

    return transposedData;
  };

  const transposedData = createTransposedData();

  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <Table className="table table-bordered" style={{ marginTop: '1.5%', border: '2px solid #e2e2e2' }}>
        <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', fontWeight: 'bold', border: '2px solid #e2e2e2'} }}>
          <TableRow>
            <TableCell>#</TableCell>
            {paginaDatos.map((_, index) => (
              <TableCell key={index}>{index + 1 + currentPage * rowsPerPage}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
          {transposedData.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid item xs={12} sm={12} sx={{ marginTop: 2, '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35" } }}>
        <TablePagination
          component="div"
          count={filtrarDatos.length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          rowsPerPageOptions={[3]}
          sx={{
            border: '2px solid #e2e2e2',
            '& .MuiTablePagination-toolbar': {
              backgroundColor: "#0f1b35",
              color: '#e2e2e2',
              display: 'flex',
              justifyContent: 'center',
            },
            '& .MuiTablePagination-selectLabel': {
              color: '#e2e2e2',
              margin: '0 1%',
            },
            '& .MuiTablePagination-input': {
              color: '#e2e2e2',
              margin: '0 1%',
            },
            '& .MuiTablePagination-selectIcon': {
              color: '#e2e2e2',
            },
            '& .MuiTablePagination-displayedRows': {
              color: '#e2e2e2',
              margin: '0 1%',
            },
            '& .MuiTablePagination-actions': {
              color: '#e2e2e2',
            }
          }}
        />
      </Grid>
    </Box>
  );
};

export default CustomForm;
