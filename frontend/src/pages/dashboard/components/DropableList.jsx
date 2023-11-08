import { Droppable } from "react-beautiful-dnd";
import   DraggableItem  from './Dragable'

const colors = [ 'red' , 'yellow' , 'blue' , 'green' , 'purple' , 'pink']; //array of colors


export default function DroppableList({characters , name , style , index}){

    return (
        
<Droppable droppableId={index.toString()}>          
    {(provided) => (
      <div className="characters" {...provided.droppableProps} ref={provided.innerRef} style={style}> 
        {characters.map(({id, name, thumb}, index) => {
          return (
            <DraggableItem key={index} id={id} index={index} name={name} thumb={thumb}/>
          );
        })}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
     
       
    )
}