import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  AppRegistrationOutlined,
  ListAltOutlined
} from '@mui/icons-material';

const CustomMenuAlmacen = ({ itemName, itemOpen, BtnMostrar, BtnRegistrar1, nombreBtn1, BtnListar1, BtnRegistrar2, nombreBtn2, BtnListar2, BtnRegistrar3, nombreBtn3, BtnListar3, drawerOpen, icon }) => {

  return (
    <>
      <ListItem button onClick={BtnMostrar} sx={{ display: 'flex', justifyContent: drawerOpen ? 'space-between' : 'center', border: '1px solid #e2e2e2', color: '#e2e2e2', transition: 'width 0.3s' }}>
        <ListItemIcon sx={{ display: 'flex', minWidth: drawerOpen ? 'auto' : 'unset' }}>
          {icon}
        </ListItemIcon>
        {drawerOpen && <ListItemText primary={`${itemName}`} sx={{ marginLeft: 1, color: '#e2e2e2', fontWeight: 'bold', textTransform: 'uppercase' }} />}
        {drawerOpen ? (itemOpen ? <ExpandLess /> : <ExpandMore />) : null}
      </ListItem>
      <Collapse in={itemOpen} timeout="auto" unmountOnExit sx={{background: '#e2e2e2', minHeight: '100vh', display: 'flex'}}>
        <ListItem button onClick={BtnRegistrar1} sx={{ display: 'flex', justifyContent: drawerOpen ? 'space-between' : 'center', border: '1px solid #0f1b35', color: '#0f1b35', transition: 'width 0.3s' }}>
          <ListItemIcon sx={{ display: 'flex', minWidth: drawerOpen ? 'auto' : 'unset' }}>
            <AppRegistrationOutlined sx={{ color: '#0f1b35' }}/>
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={`Registrar ${nombreBtn1}`} sx={{ marginLeft: 1, color: '#0f1b35', fontWeight: 'bold' }}/>}
        </ListItem>
        <ListItem button onClick={BtnListar1} sx={{ display: 'flex', justifyContent: drawerOpen ? 'space-between' : 'center', border: '1px solid #0f1b35', color: '#0f1b35', transition: 'width 0.3s' }}>
          <ListItemIcon sx={{ display: 'flex', minWidth: drawerOpen ? 'auto' : 'unset' }}>
            <ListAltOutlined sx={{ color: '#0f1b35' }}/>
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={`Lista de ${nombreBtn1}`} sx={{ marginLeft: 1, color: '#0f1b35', fontWeight: 'bold' }}/>}
        </ListItem>
        <ListItem button onClick={BtnRegistrar2} sx={{ display: 'flex', justifyContent: drawerOpen ? 'space-between' : 'center', border: '1px solid #0f1b35', color: '#0f1b35', transition: 'width 0.3s' }}>
          <ListItemIcon sx={{ display: 'flex', minWidth: drawerOpen ? 'auto' : 'unset' }}>
            <AppRegistrationOutlined sx={{ color: '#0f1b35' }}/>
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={`Registrar ${nombreBtn2}`} sx={{ marginLeft: 1, color: '#0f1b35', fontWeight: 'bold' }}/>}
        </ListItem>
        <ListItem button onClick={BtnListar2} sx={{ display: 'flex', justifyContent: drawerOpen ? 'space-between' : 'center', border: '1px solid #0f1b35', color: '#0f1b35', transition: 'width 0.3s' }}>
          <ListItemIcon sx={{ display: 'flex', minWidth: drawerOpen ? 'auto' : 'unset' }}>
            <ListAltOutlined sx={{ color: '#0f1b35' }}/>
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={`Lista del ${nombreBtn2}`} sx={{ marginLeft: 1, color: '#0f1b35', fontWeight: 'bold' }}/>}
        </ListItem>
        <ListItem button onClick={BtnRegistrar3} sx={{ display: 'flex', justifyContent: drawerOpen ? 'space-between' : 'center', border: '1px solid #0f1b35', color: '#0f1b35', transition: 'width 0.3s' }}>
          <ListItemIcon sx={{ display: 'flex', minWidth: drawerOpen ? 'auto' : 'unset' }}>
            <AppRegistrationOutlined sx={{ color: '#0f1b35' }}/>
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={`Registrar ${nombreBtn3}`} sx={{ marginLeft: 1, color: '#0f1b35', fontWeight: 'bold' }}/>}
        </ListItem>
        <ListItem button onClick={BtnListar3} sx={{ display: 'flex', justifyContent: drawerOpen ? 'space-between' : 'center', border: '1px solid #0f1b35', color: '#0f1b35', transition: 'width 0.3s' }}>
          <ListItemIcon sx={{ display: 'flex', minWidth: drawerOpen ? 'auto' : 'unset' }}>
            <ListAltOutlined sx={{ color: '#0f1b35' }}/>
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={`Lista de ${nombreBtn3}`} sx={{ marginLeft: 1, color: '#0f1b35', fontWeight: 'bold' }}/>}
        </ListItem>
      </Collapse>
    </>
  );
};

export default CustomMenuAlmacen;
