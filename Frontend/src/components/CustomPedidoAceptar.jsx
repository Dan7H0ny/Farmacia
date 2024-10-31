import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Paper } from '@mui/material';

const productosJsx = (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="right">
            <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>Producto</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>Cantidad</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pedido.productos.map((productoItem, index) => (
          <TableRow key={index}>
            <TableCell align="right">
              <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
                {productoItem.nombre} ({productoItem.tipo}):
              </Typography>
            </TableCell>
            <TableCell align="right">
              <TextField
                label={`Cantidad (máx: ${productoItem.cantidad_producto})`}
                type="number"
                InputProps={{
                  inputProps: { min: 1, max: productoItem.cantidad_producto }
                }}
                defaultValue={productoItem.cantidad_producto}
                fullWidth
                id={`cantidadInput${index}`}
                sx={{
                  backgroundColor: '#0f1b35',
                  color: '#e2e2e2',
                  '& .MuiInputBase-root': {
                    backgroundColor: '#0f1b35', // Fondo del campo
                    color: '#e2e2e2', // Color del texto
                  },
                  '& .MuiInputLabel-root': {
                    color: '#e2e2e2', // Color de la etiqueta
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e2e2e2', // Color del borde
                    },
                    '&:hover fieldset': {
                      borderColor: '#e2e2e2', // Color del borde al pasar el mouse
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e2e2e2', // Color del borde al enfocarse
                    },
                  },
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
