import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportExcelButton = ({ data, fileName, sheetName, buttonText, ...props }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
  };

  return (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  onClick={exportToExcel}
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
                >GENERAR rEPORTE
                </Button>
  );
};

export default ExportExcelButton;
