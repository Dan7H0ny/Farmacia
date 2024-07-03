import React from 'react';
import { Typography } from '@mui/material';

function CompletedTasks() {
  return (
    <div>
      <Typography variant="h5">Completed Tasks</Typography>
      <Typography variant="body1">Last Campaign Performance</Typography>
      <Typography variant="body2" color="gray">Just updated</Typography>
      {/* Aquí puedes incluir un componente de gráfico */}
    </div>
  );
}

export default CompletedTasks;
