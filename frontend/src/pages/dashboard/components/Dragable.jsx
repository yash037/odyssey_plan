import { Draggable } from "react-beautiful-dnd";
import './css/KanbanBoard.css'
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function DraggableItem({id, name, index , handleDelete , boardIndex , setBoardData}){
    return (
        <Draggable key={ id } draggableId={ id } index={ index }>
        {(provided) => (
          <div ref={ provided.innerRef } { ...provided.draggableProps } { ...provided.dragHandleProps } className="draggable-div">
            <p>
              { name }
            </p>
            <IconButton onClick={()=> {
                handleDelete( boardIndex , index , setBoardData)
            }}>
              <DeleteIcon/>
            </IconButton>
          </div>
        )}
      </Draggable>
    )
}