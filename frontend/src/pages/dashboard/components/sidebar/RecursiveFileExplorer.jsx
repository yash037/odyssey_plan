import { useState } from "react";
import { Tree } from 'antd';
import "rc-tree/assets/index.css"
import '../css/Sidebar.css'
import { IconButton } from "@mui/material";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RenamableName from "./Renamable";
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { frontendURL } from "../../../../global/request";
import { v4 as uuid} from "uuid";
const ownData = [
    {
        key : '1',
        title : <RenamableName/>,
        type : 'folder',
        children : [
            
        ],
        icon : <FolderIcon/>
        
    }
]

export default function RecursiveSidebar({ 
      files , 
      setContent , 
      name
}){
    const [ gData , setGData ] = useState(ownData);
    const [ currpos , setCurrpos ] = useState('0');
    const [ keyTracker , setKeyTracker ] = useState(100);
    
    const loop = (data, key, callback) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            loop(data[i].children, key, callback);
          }
        }
    };
    const handleAddFile = ( type , id) => {

        const data = [ ...gData ]
        if(currpos == '0') {
            setGData( [...data , {
                title : <RenamableName/>,
                key : keyTracker,
                type : 'file',
                icon : provideIcon,
                filetype : type,
                databaseId : id ,
            }])
            setKeyTracker( keyTracker + 1 )
        }
        else {
            loop( data , currpos , ( appendLocation , i , data ) => {
              if(appendLocation.type != 'folder'){
                return
              }
                appendLocation.children.splice( i , 0 , {   
                    key : `${keyTracker}`,
                    title : <RenamableName/>,
                    type : 'file',
                    icon : provideIcon,
                    filetype : type ,
                    databaseId : id
                } )
            } )
            setGData(data)
            setKeyTracker(keyTracker + 1)
        }
  }
    const handleAddFolder = ( ) => {

        const data = [ ...gData ]
        if(currpos == '0') {
            setGData( [...data , {
                title : <RenamableName/>,
                key : keyTracker,
                type : 'folder',
                children : [],
                icon : provideIcon
            }])
            setKeyTracker( keyTracker + 1 )
        }
        else {
            loop( data , currpos , ( appendLocation , i , data ) => {
                appendLocation.children.splice( i , 0 , {   
                    key : `${keyTracker}`,
                    title : <RenamableName/>,
                    type : 'folder',
                    children : [],
                    icon : provideIcon
                } )
            } )
            setGData(data)
            setKeyTracker(keyTracker + 1)
        }
    }
  const onSelect = ( selectedKeys , {node}) => {
    setCurrpos(node.key)
    if(node.type=='file'){
      setContent({type : node.filetype, databaseId : node.databaseId})
    }
   
  }
  const onDrop = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    
    const data = [...gData];

   
    let dragObj;
    let removefrom;
    let removeindex;
    loop(data, dragKey, (item, index, arr) => {
      
      removefrom = arr;
      removeindex = index;
      dragObj = item;
    });
    if (!info.dropToGap) {
      
      loop(data, dropKey, (item) => {
        if(item.type != 'folder'){
            console.log('not possible')
            return;
        }
        item.children = item.children || [];
        
        item.children.unshift(dragObj);
        removefrom.splice(removeindex, 1);
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
     
      info.node.props.expanded &&
   
      dropPosition === 1 
    ) {
      loop(data, dropKey, (item) => {
        if(item.type != 'folder'){
            console.log('not possible')
            return;
        }
        item.children = item.children || [];
       
        item.children.unshift(dragObj);
        removefrom.splice(removeindex, 1);
      });
    } else {
      let ar = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
      removefrom.splice(removeindex, 1);
    }
    setGData(data);
  };
  const onExpand = (_placeholder , { expanded , node } ) => {
    if( expanded == true ){
        setCurrpos( node.key )
    }
  }
  const provideIcon = ({ data }) => {
  
    if(data.type == 'folder'){
        return (
           <FolderIcon></FolderIcon> 
        )
    }
    else{ 
    
        switch(data.filetype){
            case 'calendar':
                return(
                    <CalendarTodayIcon/>
                )
            
            case 'doc':
                return (
                    <InsertDriveFileIcon/>
                )
            case 'note':
                return(
                  <StickyNote2Icon/>
                )
            case 'board':
                  return (
                      <DashboardIcon/>
                  ) 
            default : 
                return(
                    <FolderIcon/> 
                )
        }
        
    }
  }
  const handleAddDoc = () => {
    window.open(frontendURL + '/documents' , '_blank')
    const id = uuid()
    handleAddFile('doc' , id)
    setContent({type : 'doc', databaseId : id}) //this id corresponds to the file data in mongodb
  }
  const handleAddCalendar = () => {
    const id = uuid()
    handleAddFile('calendar' , id) 
    setContent({type : 'calendar', databaseId :id})
  }
  const handleAddBoard = () => {
    const id = uuid()
    handleAddFile('board' , id)
    setContent({type : 'board', databaseId : id})  
  }
  const handleAddNote = () => {
    const id = uuid()
    handleAddFile('note' , id)
    setContent({type : 'note', databaseId : id})
  }
  return (
    <div>
        <div className="file-explorer-buttons">
           
            <IconButton onClick={ handleAddFolder } sx={{color : 'white'}}>
                <CreateNewFolderIcon/>
            </IconButton>
            <IconButton onClick={ handleAddDoc } sx={{color : 'white'}}>
                <PostAddIcon/>
            </IconButton>
            <IconButton onClick={ handleAddCalendar} sx={{color : 'white'}}>
                <EditCalendarIcon/>
            </IconButton>
            <IconButton onClick={ handleAddBoard } sx={{color : 'white'}}>
                <ViewKanbanIcon/>
            </IconButton>
            <IconButton onClick={ handleAddNote } sx={{color : 'white'}}>
                <StickyNote2Icon/>
            </IconButton>
        </div>
        <Tree
        className="draggable-tree"
        draggable
        blockNode
        onDrop={onDrop}
        onSelect={onSelect}
        onExpand={onExpand}
        showIcon={true}
        treeData={gData}
        />
    </div>
    
  );
}