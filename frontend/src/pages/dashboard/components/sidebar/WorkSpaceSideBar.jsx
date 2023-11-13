import { Avatar, Divider, IconButton } from '@mui/material'
import '../css/Sidebar.css'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useState } from 'react';
const iconStyle = {
    width : '7vh' ,
    height : '7vh',
}
export default function WorkSpaceSidebar({data}){
    const [ activeWorkspace , setActiveWorkspace ] = useState( -1 ) // -1 means personal workspace is active
    const [ workspace , setWorkspace ] = useState( data )
    const handleWorkspaceClick = ( index ) => {
        setActiveWorkspace(index)
    }

    const handleAddClick = (  ) => {
        setWorkspace( [ ...workspace , 'new' ] )
    }
   
    return(
        <div className='workspace-sidebar'>
            <div onClick={ () => { //this represent's personal workspace
                handleWorkspaceClick(-1)               
            }} className={-1 == activeWorkspace?'active-workspace':'workspace-holder'}>
                <span></span>
                <Avatar className='workspace-icon personal-space-icon' sx={ iconStyle }></Avatar>
            </div>
           
            <Divider sx={{ border:'solid black 1.5px' , width : '50%' , margin : '6px auto'}}/>
            {
                workspace.map( ( data , index ) => {
                    return (
                        <div key={ index } onClick={() => {
                            handleWorkspaceClick(index)
                        }} className={index == activeWorkspace?'active-workspace':'workspace-holder'}>
                            <span></span>
                            <Avatar className='workspace-icon' sx={ iconStyle } ></Avatar>
                        </div> 
                    )
                })
            }
            <IconButton onClick={handleAddClick} sx={{ color:'green' }}>
                <ControlPointIcon className='workspace-icon' sx={ iconStyle } />
            </IconButton>
            
        </div>
    )
}