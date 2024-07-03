import React from 'react';
import { Typography } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Apr', uv: 400 },
  { name: 'May', uv: 300 },
  { name: 'Jun', uv: 200 },
  { name: 'Jul', uv: 278 },
  { name: 'Aug', uv: 189 },
  { name: 'Sep', uv: 239 },
  { name: 'Oct', uv: 349 },
];

function DailySales() {
  return (
    <div>
      <Typography variant="h5">Daily Sales</Typography>
      <Typography variant="body1" color="green">(+15%) increase in today sales.</Typography>
      <Typography variant="body2" color="gray">Updated 4 min ago</Typography>
      <LineChart width={400} height={200} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}

export default DailySales;
