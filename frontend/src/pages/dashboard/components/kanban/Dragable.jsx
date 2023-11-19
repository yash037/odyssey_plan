import { Draggable } from "react-beautiful-dnd";
import '../css/KanbanBoard.css'
import { IconButton, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DropdownMenu from "./DropdownMenu";
import { useState } from "react";
export default function DraggableItem({id, name, index , handleDelete , boardIndex , setBoardData , itemData , handleMountEditTask}){
    const [ dropdownAnchor , setDropdownAnchor ] = useState(null)
    return (
        <Draggable key={ id } draggableId={ id } index={ index }>
        {(provided) => (
          <div ref={ provided.innerRef } { ...provided.draggableProps } { ...provided.dragHandleProps } className="draggable-div">
            <div className="emoji-div">
              {
                
                itemData.label.map((item , index) => (
                  <div className="board-label" key={index} style={{border : `solid 2px ${item.color}`}}>
                    {console.log(item)}
                    <span>
                      {item.emoji}
                    </span>
                    <span>
                      {item.name}
                    </span>
                  </div>
                  
                ))
              }
            </div>
           
              <p>
                { name }
              </p>
              {/*
                we'll have a dropdown here
              */}
              <DropdownMenu icon={<MoreHorizIcon style={{color : 'grey'}}/>} popUp={false} anchorEl={dropdownAnchor} setAnchorEl={setDropdownAnchor}>
                <MenuItem onClick={()=> {
                      handleDelete( boardIndex , index , setBoardData)
                    }}>
                    <IconButton >
                      <DeleteIcon/>
                    </IconButton>
                    Delete
                </MenuItem>
                <MenuItem onClick={() => {handleMountEditTask(boardIndex , index)}}>
                    <IconButton>
                      <EditIcon></EditIcon>
                    </IconButton>
                    Edit
                </MenuItem>
              </DropdownMenu>
             
            </div>
          
        )}
      </Draggable>
    )
}