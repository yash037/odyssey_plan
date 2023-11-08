import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import DroppableList from './DropableList';
import './css/KanbanBoard.css'


const colors = [ 'red' , 'yellow' , 'blue' , 'green' , 'purple' , 'pink'];

function KanbanStyleBoard({data}) {
  const [boardData, setBoardData] = useState(data);

  function handleOnDragEnd(result) {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    var add;
    
    var active = parseInt(source.droppableId);
    var complete = parseInt(destination.droppableId);
    
    var activeData = boardData[active].data
    var completeData = boardData[complete].data
    
   

    var activeIndex = source.index 
    var completeIndex = destination.index
   
    if(active == complete){
        add = completeData.splice(activeIndex , 1)
        completeData.splice(completeIndex , 0 ,add[0] )
        boardData[complete].data = completeData
    }
    else{
        add = activeData[activeIndex]
        activeData.splice(activeIndex , 1)
        completeData.splice(completeIndex , 0 ,add )
        boardData[active].data = activeData
        boardData[complete].data = completeData
    }
 
    setBoardData([...boardData])
    
  }

  return (
    <div className="KanbanStyleBoard">
        <DragDropContext onDragEnd={handleOnDragEnd}>
        {
            data.map((data , index) => (
                <div key={index} className='drop-list'>
                    <div className='list-header'>
                        <div className='list-color' style={{backgroundColor:colors[index]}}></div>
                        <div className='list-title'>
                            <span className='list-title-inner'>
                                {data.name}
                            </span>
                            <span className='list-title-inner'>
                                {data.data.length}
                            </span>
                        </div>
                    </div>
                    
                    <DroppableList characters={data.data} name={data.name} index={index}/>
                </div>
                
            ))   
        }
        </DragDropContext>
    </div>
  );
}

export default KanbanStyleBoard;