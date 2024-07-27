import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';

const InfoCard = ({ title, value, icon, color, onClick }) => {
  return (
    <Card style={{
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      backgroundColor: '#0f1b35',
      border: '2px solid #e2e2e2',
      color: '#e2e2e2'
    }}>
      <CardContent style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5">
            {value}
          </Typography>
        </Box>
        <IconButton
          style={{
            backgroundColor: color,
            height: '50px',
            width: '50px',
            color: '#fff'
          }}
          onClick={onClick}
        >
          {icon}
        </IconButton>
      </CardContent>
    </Card>
  );
}

export default InfoCard;
