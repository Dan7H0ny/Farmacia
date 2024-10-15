import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const HelpIcon = ({ message }) => {
  return (
    <Tooltip title={message} arrow>
      <HelpOutlineIcon sx={{ ml: 1, cursor: 'pointer' }} />
    </Tooltip>
  );
};

export default HelpIcon;
