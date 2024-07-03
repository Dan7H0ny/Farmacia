import React from 'react';
import { Typography } from '@mui/material';

function WebsiteViews() {
  return (
    <div>
      <Typography variant="h5">Website Views</Typography>
      <Typography variant="body1">Last Campaign Performance</Typography>
      <Typography variant="body2" color="gray">Campaign sent 2 days ago</Typography>
      {/* Aquí puedes incluir un componente de gráfico */}
    </div>
  );
}

export default WebsiteViews;
