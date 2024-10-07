import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Grid, TablePagination, Button, Box } from '@mui/material';
import {Visibility, CheckBox, IndeterminateCheckBox, DisabledByDefault, HighlightOff, CheckCircleOutline} from '@mui/icons-material';
import '../assets/css/tabla.css';

const CustomTablaPedidos = ({ pedidos, buscar, botonAceptar, botonRechazar, botonMostrar }) => {
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

  const filtrarDatos = pedidos.filter(elemento => {
    const { proveedor} = elemento;
    const busqueda = buscar.toLowerCase();

    return (
      proveedor.toLowerCase().includes(busqueda) 
    );
  });

  const paginaDatos = filtrarDatos.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Confirmado':
        return <CheckBox style={{ color: 'green' }} />;
      case 'Pendiente':
        return <IndeterminateCheckBox style={{ color: '#1E90FF' }} />;
      case 'Rechazado':
        return <DisabledByDefault style={{ color: 'red' }} />;
      default:
        return null;
    }
  };
  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Table className="table table-bordered" style={{ marginTop: '1.5%', border: '2px solid #e2e2e2' }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', fontWeight: 'bold', border: '2px solid #e2e2e2' } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Cantidad Pedida</TableCell>
                <TableCell>Precio Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Aceptar</TableCell>
                <TableCell>Rechazar</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
              {paginaDatos.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                  <TableCell>{x.proveedor}</TableCell>
                  <TableCell>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        { productoItem.nombre }
                      </div>
                    ))}
                  </TableCell>
                  <TableCell sx={{width: 100 }}>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        {productoItem.cantidad_producto}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell sx={{width: 150 }}>{x.precio_total.toFixed(2)  + ' Bs'}</TableCell>
                  <TableCell sx={{width: 100 }}>
                    {getEstadoIcon(x.estado)}
                  </TableCell>
                  <TableCell sx={{width: 150 }}>
                    <Button variant="contained" color="success" onClick={() => botonAceptar(x)} sx={{ backgroundColor: "success", color: "#e2e2e2", border: '2px solid #e2e2e2' }}>
                      <CheckCircleOutline />
                    </Button>
                  </TableCell>                  
                  <TableCell sx={{width: 150 }}>
                    <Button variant="contained" color="error" onClick={() => botonRechazar(x)} sx={{ backgroundColor: "#ff2301", color: "#e2e2e2", border: '2px solid #e2e2e2' }}>
                      <HighlightOff />
                    </Button>
                  </TableCell>
                  <TableCell sx={{width: 150 }}>
                    <Button variant="contained" onClick={() => botonMostrar(x)} sx={{ color: "#e2e2e2", border: '2px solid #e2e2e2' }}>
                      <Visibility />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TablePagination
            component="div"
            count={filtrarDatos.length}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por por pagina"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            rowsPerPageOptions={[5, 10, 15, 20]}
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
      </Grid>
    </Box>
  );
};

export default CustomTablaPedidos;
