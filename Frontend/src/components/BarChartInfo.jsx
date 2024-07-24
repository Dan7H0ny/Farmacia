import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BarChartInfo = () => {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const generateLabels = () => {
      const today = new Date();
      // Generate labels starting from today
      const labels = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        labels.push(day.toLocaleDateString('es-ES', { weekday: 'long' }));
      }

      setLabels(labels);
    };

    generateLabels();
  }, []);
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Open',
        data: [200, 300, 400, 500, 600, 700, 800],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: 'Click',
        data: [100, 150, 200, 250, 300, 350, 400],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: 'Click Second Time',
        data: [50, 75, 100, 125, 150, 175, 200],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Card style={{ margin: 5, borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Users Behavior
          </Typography>
          <IconButton aria-label="sync">
            <SyncIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          24 Hours performance
        </Typography>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
}

export default BarChartInfo;
