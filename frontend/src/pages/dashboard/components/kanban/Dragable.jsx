import { Draggable } from "react-beautiful-dnd";
import '../css/KanbanBoard.css'
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export default function DraggableItem({id, name, index , handleDelete , boardIndex , setBoardData , itemData}){
    return (
        <Draggable key={ id } draggableId={ id } index={ index }>
        {(provided) => (
          <div ref={ provided.innerRef } { ...provided.draggableProps } { ...provided.dragHandleProps } className="draggable-div">
            <div className="emoji-div">
              {
                itemData.label.map((item , index) => (
                  <span key={index}>
                      {item.emoji}
                  </span>
                ))
              }
            </div>
           
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