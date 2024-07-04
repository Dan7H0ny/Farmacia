import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  display: 'flex',
  alignItems: 'center',
  padding: '2.5%',
  borderRadius: '15%',
  backgroundColor: '#0f1b35',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
});

const IconContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40%',
  height: '40%',
  borderRadius: '12px',
  backgroundColor: '#0f1b35', 
  marginRight: '16px',
});

const GrowthText = styled(Typography)({
  color: '#7ffddd',
  fontWeight: 'bold',
  marginTop: 1,
});

const CustomInfoDashboard = ({ icon, text, number, porcentaje}) => {

  return (
    <StyledCard>
      <IconContainer>
        <Avatar sx={{ backgroundColor: '#0f1b35', color: '#e2e2e2', border: '2px solid #e2e2e2', width:'50%', height:'50%'}}>{icon}</Avatar>
      </IconContainer>
      <CardContent>
        <Typography variant="subtitle2" color="#e2e2e2" fontWeight='bold' textTransform='Uppercase'>{text}</Typography>
        <Typography variant="h4" color="#e2e2e2">{number}</Typography>
        <GrowthText variant="body2">{porcentaje}</GrowthText>
      </CardContent>
    </StyledCard>
  );
};

export default CustomInfoDashboard;
