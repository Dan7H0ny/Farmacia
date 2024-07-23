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
      variant="contained"
      color="primary"
      onClick={exportToExcel}
      {...props}
    >
      {buttonText || 'Generar Reportes'}
    </Button>
  );
};

export default ExportExcelButton;
