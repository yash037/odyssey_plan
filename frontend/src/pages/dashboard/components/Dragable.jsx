import { Draggable } from "react-beautiful-dnd";
export default function DraggableItem({id, name, index}){
    return (
        <Draggable key={ id } draggableId={ id } index={ index }>
        {(provided) => (
          <div ref={ provided.innerRef } { ...provided.draggableProps } { ...provided.dragHandleProps } className="draggable-div">
            <div className="parent-draggable"> {/* put react svg inside this div */}
             
            </div>
            <p>
              { name }
            </p>
          </div>
        )}
      </Draggable>
    )
}