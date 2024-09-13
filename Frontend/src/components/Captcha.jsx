import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import '../assets/css/Captcha.css';

const Captcha = ({ onVerify }) => {
  const [captchaText] = useState(generateCaptcha());

  function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 5; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  }

  const handleInputChange = (e) => {
    // Notify the parent component whether the captcha input matches the generated captcha
    onVerify(e.target.value === captchaText);
  };

  return (
    <Box className="captcha-container" sx={{textAlign:'center'}}>
      <Typography variant="h6" color="#e2e2e2">Ingresa el CAPTCHA</Typography>
      <Box className="captcha-box">
        <Typography variant="h5" color="#0f1b35">{captchaText}</Typography>
      </Box>
      <input
        type="text"
        placeholder="Escribe el CAPTCHA"
        onChange={handleInputChange}
        className="captcha-input"
      />
    </Box>
  );
};

export default Captcha;
