import { useState } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import EmojiPicker from 'emoji-picker-react';
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

export default function Icon ({ emoji , setGData , id}){
    const [ emo , setEmo ] = useState(emoji)
    const [ editable , setEditable ] = useState(false)
    const handleDoubleClick = () => {
        setEditable(!editable)
    }
    
    
   
    const handleEmojiClick = (e) => {
        setEditable(false)
        setEmo(e.emoji)
        const loop = ( data , key ) => {
       
            data.forEach((item) => {
                if (item.key == key) {
                  item.emoji = e.emoji;
                }
                if (item.children) {
                  loop(item.children , key);
                }
            }
            )
        }
       
        setGData((gData) => {
             
            loop( gData , id )
            return gData
        })
    }

    return (
        !editable?  (<span 
                    onDoubleClick={handleDoubleClick}
                    style={{
                        fontSize : '3vh'
                    }}
                    >
                        {emo}
                    </span>
                    ):
                    (
                       editable&&
                       (
                        <div>
                            <EmojiPicker 
                            onEmojiClick={handleEmojiClick}
                            />
                        </div>
                       )
                       
                    )    
    )
}