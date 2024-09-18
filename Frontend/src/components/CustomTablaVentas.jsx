import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Grid, TablePagination, Button, Box, CircularProgress } from '@mui/material';
import { Visibility, ModeEdit } from '@mui/icons-material';
import '../assets/css/tabla.css';
import { format } from 'date-fns';

const CustomTablaVentas = ({ usuarios, buscar, botonMostrar, botonActualizar }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true); // Estado para el spinner de carga

  // Simulamos el proceso de carga para cuando lleguen los datos
  useEffect(() => {
    if (usuarios && usuarios.length > 0) {
      setLoading(false); // Datos recibidos, dejamos de cargar
    }
  }, [usuarios]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filtrarDatos = usuarios.filter(elemento => {
    const { cliente, productos } = elemento;
    const busqueda = buscar.toLowerCase();
    const productoCoincide = productos.some(producto => 
      producto.nombre.toLowerCase().includes(busqueda)
    );

    return (
      cliente.nombreCompleto.toLowerCase().includes(busqueda) ||
      productoCoincide
    );
  });

  const paginaDatos = filtrarDatos.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      {loading ? ( // Si está cargando, mostramos el spinner
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#0f1b35' }} /> {/* Spinner de carga */}
        </Box>
      ) : ( // Si no está cargando, mostramos la tabla
        <>
          <Table className="table table-bordered" style={{ marginTop: '1.5%', border: '2px solid #e2e2e2' }}>
            <TableHead className="text-center" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', fontWeight: 'bold', border: '2px solid #e2e2e2' } }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Precio Total</TableCell>
                <TableCell>Fecha de Registro</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-center align-baseline" sx={{ '& .MuiTableCell-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", textAlign: 'center', border: '2px solid #e2e2e2' } }}>
              {paginaDatos.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                  <TableCell>{x.cliente.nombreCompleto}</TableCell>
                  <TableCell>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        { productoItem.nombre }
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        {productoItem.cantidad_producto}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {x.productos.map((productoItem, prodIndex) => (
                      <div key={prodIndex}>
                        { productoItem.precio_venta.toFixed(2) + ' Bs' }
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{x.precio_total.toFixed(2)  + ' Bs'}</TableCell>
                  <TableCell>{format(x.fecha_registro, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => botonMostrar(x)} sx={{ backgroundColor: "#0f1b35", color: "#e2e2e2", border: '2px solid #e2e2e2' }}>
                      <Visibility />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" onClick={() => botonActualizar(x)} sx={{ backgroundColor: "#0f1b35", color: "#e2e2e2", border: '2px solid #e2e2e2' }}>
                      <ModeEdit />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Grid item xs={12} sm={12} sx={{ marginTop: 2, '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
            <TablePagination
              component="div"
              count={filtrarDatos.length}
              page={currentPage}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              rowsPerPageOptions={[5, 10, 15, 20]}
              sx={{ border: '2px solid #e2e2e2',
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
        </>
      )}
    </Box>
  );
};

export default CustomTablaVentas;
