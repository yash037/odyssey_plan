import './components/css/Dashboard.css'
import Navbar from './components/navbar/Navbar';
import WorkSpaceSidebar from './components/sidebar/WorkSpaceSideBar';
import Content from './components/content/Content';
import { useEffect, useState } from 'react';
import { backendURL, send } from '../../global/request';
import RecursiveSidebar from './components/sidebar/RecursiveFileExplorer';
import RecursiveSidebarMultiple from './components/sidebar/RecursiveFileExplorerMultiple';
import  { stringify , parse } from 'flatted'
import CapsuleButton from './components/kanban/CapsuleButton';
import { Divider } from '@mui/material';
import io from 'socket.io-client'
import TeamspaceModal from './components/sidebar/TeamSpaceModal';

// the plan is everytime a component is actually mounted 
// 
export default function DashBoard(){
    const [ content , setContent ] = useState({ type : 'doc' , databaseId : '1xef' }) //this id correspond's to default kanban data
    const [ personalSpace , setPersonalSpace ] = useState([]) //personal space is at index 0
    const [ workSpaces , setWorkSpaces ] = useState({}) //this is mapping of id vs data 
    const [ workSpacesIdArray , setWorkSpacesIdArray ] = useState([])
    const [ socket , setSocket ] = useState(null)
    const view = content.type
    const databaseId = content.databaseId  
    console.log(workSpaces , workSpacesIdArray)
    useEffect(
        ()=>{console.log(content.databaseId)}
        ,[content]
    )
    useEffect(
        () => {
            const getData = async () => {
                const res = await   send.get(backendURL + '/data/getFolder' , {
                    params : {
                        workspaceId : 'personal'
                    }
                })
                if(res.status == 200){
                    setPersonalSpace(parse(res.data.data.folderStructure))
                }
                if(res.status == 201){
                    setPersonalSpace([])
                }  
            }
            getData()
        }
        
        ,
        []
    )
    useEffect(
        () => {
            console.log('saving')
            const sendData = async ( personalSpace ) => {
             
                try{
                    const recur = ( data ) => {
                        if(data == null){
                            return
                        }
                        data.forEach(
                            ( item ) => {
                                item.title = ""
                                recur(data.children)
                            }
                        )
                    }
                    recur(personalSpace)
                    const payload = stringify(personalSpace)
                    const res =  await send.post(backendURL + '/data/saveFolder' , {
                        data : {
                            workspaceId : 'personal',
                            content : payload
                        }    
                    })
                }
                catch(e){
                    console.log(e)
                }   
            }
            
            sendData(personalSpace)
            console.log('end')
        }
        ,[personalSpace]
    )
    useEffect(
        () => {
            const getWorkspaces = async () => {
               const res = await send.get(backendURL + '/data/getWorkspaces')
               var workspaceIdArray = []
               var workspace = {}
               if( res.status == 200 ){
                workspaceIdArray =  res.data.workSpaceIdArray

                workspace = res.data.workspace
               }
               console.log(res.data)
               setWorkSpacesIdArray(workspaceIdArray)
               setWorkSpaces(workspace)
            }     
            getWorkspaces()       
        }
        ,
        []
    )
    useEffect(() => {
        const socket = io("http://localhost:3001");
        setSocket(socket)
        return (
            () => {
                socket.disconnect()
            }
        )
    },[])
    
   
    const handleAdvancedSearch = ()=>{
        console.log('open search')  
    }
    const handleVCS = ()=>{
        console.log('show vcs')  
    }
    const hanldeSettings = ()=> {
        console.log('show settings')                    
    }
    
    return (
        <div className='dashboard'>
            
            <Navbar/>
            <WorkSpaceSidebar 
            data={ [ 's1' , 's2' ] }
            />
            <div className="sidebar-div">
                <CapsuleButton handler={handleAdvancedSearch}>
                    Search
                </CapsuleButton>
                <CapsuleButton handler={handleVCS}>
                    Updates
                </CapsuleButton>
                <CapsuleButton handler={hanldeSettings}>
                    Settings
                </CapsuleButton>
                <div>
                    <div>
                        <span>
                            TeamSpaces
                        </span>
                        <TeamspaceModal 
                        setWorkSpacesIdArray={setWorkSpacesIdArray}
                        setWorkSpaces={setWorkSpaces}
                        ></TeamspaceModal>
                    </div>
                    
                    <Divider></Divider>
                    {
                        socket==null?'':workSpacesIdArray.map((workspaceId , index) => {
                            console.log(workSpaces[workspaceId])
                            return(
                            <RecursiveSidebarMultiple 
                            key={workspaceId} 
                            workSpaceId={workspaceId} 
                            socket={socket} 
                            setContent={setContent}
                            setFiles={setWorkSpaces}
                            files={parse(workSpaces[workspaceId].folderStructure)}
                            name={workSpaces[workspaceId].name}
                            >

                            </RecursiveSidebarMultiple>
                            )
                        })
                    }
                </div>
                <div>
                    <span>
                        Private
                    </span>
                    <Divider></Divider>
                    <RecursiveSidebar 
                    setFiles={setPersonalSpace}
                    files={personalSpace}
                    index={0} 
                    setContent={setContent}
                    name={'personal space'}
                    ></RecursiveSidebar>
                </div>
                
   
            </div>  
            <div className='content-div'>
                <Content 
                view = {view} 
                databaseId = {databaseId}
                key={databaseId}
                />
            </div>
        </div>
        

    )
}