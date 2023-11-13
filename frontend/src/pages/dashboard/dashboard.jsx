import './components/css/Dashboard.css'
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import WorkSpaceSidebar from './components/sidebar/WorkSpaceSideBar';
import Content from './components/content/Content';
import { useEffect, useState } from 'react';
// the plan is everytime a component is actually mounted 
// 
export default function DashBoard(){
    const [ content , setContent ] = useState({ type : 'doc' , databaseId : '1xef' }) //this id correspond's to default kanban data
    const view = content.type
    const databaseId = content.databaseId
    useEffect(
        () => {
            console.log( content.databaseId )

        },
        [content]
    )    
    return (
        <div className='dashboard'>
            
            <Navbar/>
            <WorkSpaceSidebar 
            data={ [ 's1' , 's2' ] }
            />
            <Sidebar 
            setContent={setContent}
            />  
            <div className='content-div'>
                <Content 
                view = {view} 
                databaseId = {databaseId}
                data={[{id : '1' , data : [] , name : 'done'}]}
                />
            </div>
        </div>
        
    )
}