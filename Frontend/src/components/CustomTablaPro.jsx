import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Grid, TablePagination, Button, Box } from '@mui/material';
import { Visibility, ModeEdit } from '@mui/icons-material';
import '../assets/css/tabla.css';

const CustomTablaPro = ({ usuarios, buscar, botonMostrar, botonActualizar }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(0);
  }, [buscar]);
  
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };
  const filtrarDatos = usuarios.filter(elemento => {
    const { nombre_marca, nombre_vendedor } = elemento;
    const busqueda = buscar.toLowerCase();
  
    return (
      nombre_marca.toLowerCase().includes(busqueda) ||
      nombre_vendedor.toLowerCase().includes(busqueda) 
    );
  });
  

  const paginaDatos = filtrarDatos.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
      <Table className="table table-bordered"  style={{ marginTop: '1.5%', border: '2px solid #e2e2e2' }}>
          <TableHead className="text-center" sx={{ '& .MuiTableCell-root': {color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', fontWeight: 'bold', border: '2px solid #e2e2e2'} }}>
            <TableRow >
              <TableCell>#</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Nombre del Vendedor</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell>Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': {color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
            {paginaDatos.map((x, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                <TableCell>{x.nombre_marca}</TableCell>
                <TableCell>{x.nombre_vendedor}</TableCell>
                <TableCell >
                  <Button variant="contained" onClick={() => botonMostrar(x) } sx={{backgroundColor: "#0f1b35", color:" #e2e2e2", border: '2px solid #e2e2e2'}}>
                    <Visibility />
                  </Button>
                </TableCell>
                <TableCell >
                  <Button variant="contained" color="success" onClick={() => botonActualizar(x)} sx={{backgroundColor: "#0f1b35", color:" #e2e2e2", border: '2px solid #e2e2e2'}}>
                    <ModeEdit  />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Grid>
        <Grid item xs={12} sm={12} sx={{ '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
          <TablePagination
            component="div"
            count={filtrarDatos.length}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por por pagina"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            rowsPerPageOptions={[5, 10, 15, 20 ]}
            sx={{ border: '2px solid #e2e2e2',
              '& .MuiTablePagination-toolbar': {
                backgroundColor: "#0f1b35",
                color: '#e2e2e2',
                display: 'flex',
                justifyContent: 'center', // Centra el contenido dentro de la toolbar
              },
              '& .MuiTablePagination-selectLabel': {
                color: '#e2e2e2',
                margin: '0 1%', // Ajusta el margen para centrar
              },
              '& .MuiTablePagination-input': {
                color: '#e2e2e2',
                margin: '0 1%', // Ajusta el margen para centrar
              },
              '& .MuiTablePagination-selectIcon': {
                color: '#e2e2e2',
              },
              '& .MuiTablePagination-displayedRows': {
                color: '#e2e2e2',
                margin: '0 1%', // Ajusta el margen para centrar
              },
              '& .MuiTablePagination-actions': {
                color: '#e2e2e2',
              }
            }}
          />
        </Grid>
        </Grid>
    </Box>
  );
};

export default CustomTablaPro;
