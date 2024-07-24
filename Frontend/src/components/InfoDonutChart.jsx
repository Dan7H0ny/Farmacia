import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const InfoDonutChart = () => {
  const data = {
    labels: ['Desktop', 'Tablet', 'Phone'],
    datasets: [
      {
        label: 'Traffic Source',
        data: [63, 15, 22],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <Card style={{ margin: 5, borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center">
          PRODUCTOS MAS VENDIDOS
        </Typography>
        <Doughnut data={data} options={options} />
      </CardContent>
    </Card>
  );
}

export default InfoDonutChart;
