import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Grid, TablePagination, Button, Box } from '@mui/material';
import { Visibility, ModeEdit } from '@mui/icons-material';
import '../assets/css/tabla.css';
import ExportExcelButton from '../components/ExportExcelButton';

const CustomTablaVentas = ({ usuarios, buscar, botonMostrar, botonActualizar }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [ventas, setVentas] = useState([]);
  
  useEffect(() => {
    if (usuarios.length > 0) {
      const datosTransformados = usuarios.map(usuario => {
        const fechaRegistro = new Date(usuario.fecha_registro);
        const fechaActualizacion = new Date(usuario.fecha_actualizacion);
        
        const opciones = {
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: false // Usar formato de 24 horas
        };

        return {
          NombreCliente: usuario.cliente.nombreCompleto,
          Identificacion: usuario.cliente.stringIdentity.nombre,
          NumeroIdentificacion: usuario.cliente.combinedIdentity, 
          Productos: usuario.productos.map(prod => `${prod.nombre} - ${prod.tipo} - ${prod.proveedor} - ${prod.categoria} - (${prod.cantidad_producto} unidades) - ${prod.precio_venta}`).join(', '), // Asumiendo que es un array
          TotalVenta: usuario.precio_total,
          FechaRegistro: fechaRegistro.toLocaleString('es-ES', opciones),
          FechaActualizacion: fechaActualizacion.toLocaleString('es-ES', opciones),
          UsuarioRegistro: `${usuario.usuario_registra.nombre} - ${usuario.usuario_registra.apellido} - ${usuario.usuario_registra.rol}`,
          UsuarioUpdate: `${usuario.usuario_update.nombre} - ${usuario.usuario_update.apellido} - ${usuario.usuario_update.rol}`,    
        };
      });
      setVentas(datosTransformados);
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
    const { cliente } = elemento;
    const busqueda = buscar.toLowerCase();
  
    return (
      cliente.nombreCompleto.toLowerCase().includes(busqueda)
    );
  });

  const paginaDatos = filtrarDatos.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
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
                    { productoItem.precio_venta }
                  </div>
                ))}
              </TableCell>
              <TableCell>{x.precio_total}</TableCell>
              <TableCell>{new Date(x.fecha_registro).toISOString().split('T')[0]}</TableCell>
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
      <Grid item xs={12} sm={12} sx={{ '& .MuiTextField-root': { color: '#e2e2e2', backgroundColor: "#0f1b35", } }}>
        <ExportExcelButton
          data={ventas}
          fileName="Reporte de Ventas"
          sheetName="Ventas"
          sx={{ mt: 2 }}
        />
      </Grid>
    </Box>
  );
};

export default CustomTablaVentas;
