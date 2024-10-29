// CustomListItem.jsx
import React from 'react';
import { ListItem } from '@mui/material';

const CustomListItem = ({ isSelected, isCollapsed, ...props }) => {
  return (
    <ListItem
    {...props}
      sx={{
        backgroundColor: isSelected ? 'rgb(237, 231, 246)' : 'white',
        borderRadius: '10px',
        mb: 1,
        color: '#5e35b1',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // padding: isCollapsed ? '8px' : '8px',
      }}
    >
      {/* {props.children} */}
    </ListItem>
  );
};

export default CustomListItem;
