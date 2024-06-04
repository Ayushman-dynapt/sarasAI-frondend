import React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';



const NestedList = () => {
    const [openManageTAs, setOpenManageTAs] = React.useState(false);
  const [openManageCoaches, setOpenManageCoaches] = React.useState(false);

  const handleManageTAsClick = () => {
    setOpenManageTAs(!openManageTAs);
  };

  const handleManageCoachesClick = () => {
    setOpenManageCoaches(!openManageCoaches);
  };

  
    return (
        <List
        sx={{ width: '100%', maxWidth: 360 , color: 'white'}}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={handleManageTAsClick}>
          <ListItemText primary="Manage TAs" />
          {openManageTAs ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openManageTAs} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{boxShadow : '0 0 10px 0 rgba(0, 0, 0, 0.3)', borderRadius:'0 0 20px 20px'}}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="TA Mapping" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="TA Availability" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="TA Scheduling" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />
        <ListItemButton onClick={handleManageCoachesClick}>
          <ListItemText primary="Manages Coaches" />
          {openManageCoaches ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openManageCoaches} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{boxShadow : '0 0 10px 0 rgba(0, 0, 0, 0.3)', borderRadius:'0 0 20px 20px'}}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Coach Mapping" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Coach Template" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Coach Availability" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Coach Scheduling" />
            </ListItemButton>
          </List>
        </Collapse>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Courses" />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Coaching Tools" />
        </ListItemButton>
      </List>
    );
  }


  export default NestedList;