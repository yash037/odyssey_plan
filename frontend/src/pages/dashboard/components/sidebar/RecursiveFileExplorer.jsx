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
import CapsuleButton from "../CapsuleButton";
import Icon from "./IconProvider";
import Search from "antd/es/input/Search";
const ownData = [
    
]
const { TreeNode } = Tree;
export default function RecursiveSidebar({ 
      files , 
      setContent , 
      name
}){
    const [ gData , setGData ] = useState(ownData);
    const [ currpos , setCurrpos ] = useState('0');
    const [ keyTracker , setKeyTracker ] = useState(100);
    const [ disabled , setDisabled ] = useState(true)
    const [ text , setText ] = useState('')
    const [ expandedKeys , setExpandedKeys ] = useState([])
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
              key : `${keyTracker}`,
              name : 'Untitled',
              type : 'file',
              filetype : type,
              databaseId : id
              
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
                  name : 'Untitled',
                  type : 'file',
                  filetype : type,
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
              key : `${keyTracker}`,
              name : 'Untitled',
              type : 'folder',
              children : [
                  
              ],

              
          }])
            setKeyTracker( keyTracker + 1 )
        }
        else {
            loop( data , currpos , ( appendLocation , i , data ) => {
                appendLocation.children.splice( i , 0 , {
                  key : `${keyTracker}`,
                  name : 'Untitled',
                  type : 'folder',
                  children : [
                      
                  ],
                  
              } )
            } )
            setGData(data)
            setKeyTracker(keyTracker + 1)
        }
    }
  const onSelect = (node) => {
    
    setCurrpos(node.key)
    if(node.type=='file'){
      setContent({type : node.filetype, databaseId : node.databaseId})
      setDisabled(true)
    }
    else{
      setDisabled(false)
    }
   
  }
  const onDrop = (info) => {
    
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
  const onExpand = (newKeys , { expanded , node } ) => {
    setExpandedKeys(newKeys)
    if( expanded == true ){
        setCurrpos( node.key )
    }
  }
  const provideIcon = ( data ) => {
   
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
    const id = uuid()
    window.open(frontendURL + `/documents/${id}` , '_blank')
    handleAddFile('doc' , id)
    setContent({type : 'doc', databaseId : id}) //this id corresponds to the file data in mongodb
  }
  const handleAddCalendar = () => {
    const id = uuid()
    window.open(frontendURL + `/calendar` , '_blank')
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
  const handleRootAddClick = () => {
    setGData(
      [
        ...gData ,
        {
          key : `${keyTracker}`,
          type : 'folder',
          name : 'Untitled',
          children : [
              
          ],
         
          
      }
      ]
     
    )
    setKeyTracker(keyTracker + 1)
  }
  const renderTreeNodes = (data) => {
     
    let nodeArr = data.map((item) => {
     
      if(item.emoji == null){
        item.emoji = (
          provideIcon({ type :item.type , filetype :item.filetype})
        )
      }
        item.title = (
          <div onClick={()=>{
            onSelect(item)
          }}
          className="node"
          >
              <Icon 
                id={item.key} 
                emoji={item.emoji}
                setGData={setGData}
              />
              <RenamableName
              key={item.key}
              name={item.name}
              setGData={setGData}
              id={item.key}
            />
          </div>
          
        )

      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} type={item.type} filetype={item.filetype}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode title={item.title} key={item.key}  />;
    });

    return nodeArr;
  };
  const handleSearchChange = (e) => {
    setText(e.target.value)
    setExpandedKeys([])
    const recur = ( data , name ) => {
        data.forEach((item) => {
            if (item.name.includes(name) == true ) {
              if( name == '' ){
                return
              }
              console.log('found')
              setExpandedKeys(
                (expandedKeys) => (
                  [
                    ...expandedKeys , item.key
                  ]
                )
              )
            }
            if (item.children) {
              recur(item.children , name);
            }
        }
      )
  }
  recur( gData , e.target.value )
  }
  return (
    <div>
      <Search 
        value={text} 
        onChange={handleSearchChange}
        onBlur={()=>{
          setExpandedKeys([])
        }}
      />
        <div className="file-explorer-buttons">
           
            <IconButton onClick={ handleAddFolder } sx={{color : 'white'}} disabled={disabled}>
                <CreateNewFolderIcon/>
            </IconButton>
            <IconButton onClick={ handleAddDoc } sx={{color : 'white'}} disabled={disabled}>
                <PostAddIcon/>
            </IconButton>
            <IconButton onClick={ handleAddCalendar} sx={{color : 'white'}} disabled={disabled}>
                <EditCalendarIcon/>
            </IconButton>
            <IconButton onClick={ handleAddBoard } sx={{color : 'white'}} disabled={disabled}>
                <ViewKanbanIcon/>
            </IconButton>
            <IconButton onClick={ handleAddNote } sx={{color : 'white'}} disabled={disabled}>
                <StickyNote2Icon/>
            </IconButton>
        </div>
        <Tree
        className="draggable-tree"
        draggable
        blockNode
        onDrop={onDrop}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        showIcon={true}
        treeData={gData}
        autoExpandParent={true}
        >
          {renderTreeNodes(gData)}
        </Tree>
        <CapsuleButton handler={handleRootAddClick}>
          Create Add
        </CapsuleButton>
    </div>
    
  );
}