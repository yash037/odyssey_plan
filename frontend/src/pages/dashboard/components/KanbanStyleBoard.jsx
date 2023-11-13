
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import DroppableList from './DropableList';
import './css/KanbanBoard.css'
import CapsuleButton from './CapsuleButton';
import TaskEditor from './TaskEditor';

const colors = [ 'red' , 'yellow' , 'blue' , 'green' , 'purple' , 'pink'];

function KanbanStyleBoard( { data } ) {
  const [boardData, setBoardData] = useState(data);
  const [ taskEditorActive , setTaskEditorActive ] = useState(true);
  const [ idTrack , setIdTrack ] = useState(100);


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
 
  const handleDeleteTask = ( boardIndex , elementIndex , change ) => {
    boardData[boardIndex].data.splice(elementIndex,1)
    setIdTrack((id)=>(id + 1)) //workaround for some bug
    //something is wrong with state
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
                  <div className='kanban-board-content'>
                    <DroppableList 
                    characters={data.data} 
                    name={data.name} 
                    index={index} 
                    handleDelete={handleDeleteTask} 
                    setBoardData={setBoardData}/>
                    <CapsuleButton text={'Add a Task'} handler={() => {
                      setTaskEditorActive(!taskEditorActive)
                    }}/>
                  </div>  
                   
                </div>
                
            ))   
        }

        </DragDropContext>
        <div className='task-editor-div'>
          
             {
              taskEditorActive&& <TaskEditor 
              setTaskEditorActive={setTaskEditorActive}
              setBoardData={setBoardData}
              boardData={boardData} 
              setIdTrack={setIdTrack}
              idTrack={idTrack}
              />
             }
             
              
            
          </div>
    </div>
  );
}

export default KanbanStyleBoard;