import { useState  } from "react";
import { IconButton , Menu } from "@mui/material";

const popupAnchor = {
    vertical: 'top', 
    horizontal: 'left',
}

const popupTransform = {
    vertical: 'bottom', 
    horizontal: 'left',
}

const dropdownTransform  = {
    vertical: 'bottom', 
    horizontal: 'right',
}

const dropdownAnchor = {
    vertical: 'top', 
    horizontal: 'right',
}

export default function DropdownMenu({ popUp , icon , children , setAnchorEl , anchorEl}) {
  
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <IconButton
          aria-controls="dropdown-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
         {icon}
        </IconButton>
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          keepMounted
          anchorOrigin={popUp == true ? popupAnchor : dropdownAnchor}
          transformOrigin={popUp == true ? popupTransform : dropdownTransform}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
            {
                children
            }
            
        </Menu>
      </div>
    );
}