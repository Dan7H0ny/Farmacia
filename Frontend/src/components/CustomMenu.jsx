import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  AppRegistrationOutlined,
  ListAltOutlined
} from '@mui/icons-material';

const CustomMenu = ({ itemName, itemOpen, BtnMostrar, BtnRegistrar, BtnListar, drawerOpen, icon }) => {

  return (
    <>
      <ListItem button onClick={BtnMostrar} sx={{ color: '#eeca06' }}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        {drawerOpen && <ListItemText primary={`Gestionar ${itemName}`} sx={{ color: '#eeca06' }} />}
        {drawerOpen ? (itemOpen ? <ExpandLess /> : <ExpandMore />) : null}
      </ListItem>
      <Collapse in={itemOpen && drawerOpen} timeout="auto" unmountOnExit>
        <ListItem button onClick={BtnRegistrar}>
          <ListItemIcon>
            <AppRegistrationOutlined />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={`Registrar ${itemName}`} />}
        </ListItem>
        {BtnListar && (
          <ListItem button onClick={BtnListar}>
            <ListItemIcon>
              <ListAltOutlined />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary={`Lista de ${itemName}`} />}
          </ListItem>
        )}
      </Collapse>
    </>
  );
};

export default CustomMenu;
