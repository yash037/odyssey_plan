import MoreHoriz from "@mui/icons-material/MoreHoriz"
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { CardContent, IconButton, Modal , Card } from "@mui/material"
import { useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import { backendURL, send } from "../../../../global/request";
import EmojiPicker from "emoji-picker-react";
import { v4 as uuid } from "uuid";

export default function TeamspaceModal({setWorkSpacesIdArray , setWorkSpaces}){
    const [ open , setOpen ] = useState(false)
    const [ name , setName ] = useState('')
    const [ emojiOpen , setEmojiOpen ] = useState(false)
    const [ emoji , setEmoji ] = useState('🥰')
    const handleModalClose = () => {
        setOpen(false)
        setName('')
        setEmojiOpen(false)
        setEmoji('🥰')
    }
    const handleModalOpen = () => {
        setOpen(true)
    }
    const handleChangeName = (e) => {
        setName(e.target.value)
    }
    const handleSubmit = async () => {
        console.log('here')
        const res = await send.post(backendURL + '/data/createWorkspace' , {
            data : {
                accessType : 'public',
                name : name,
                icon : emoji,
                workspaceId : uuid(),
            }
        })
        console.log(res)
        if( res.status == 200 ){
            setWorkSpacesIdArray((idArray) => ([...idArray , res.data.workspaceId]))
            setWorkSpaces((data)=>({...data , [ res.data.workSpaceId ] : { name : name , folderStructure : '[[]]' , icon : emoji } }))
        }
    }
    const handleEmojiClick = (e) => {
        setEmojiOpen(false)
        setEmoji(e.emoji)
    }
    return(
        <>
            <IconButton onClick={handleModalOpen}>
                <AddIcon/>
            </IconButton>
            <Modal
            open={open}
            onClose={handleModalClose}
            sx={{width : '40vw' , height: '30vh' , position : 'fixed' , top : '30vh' , margin : '0 auto'}}
            >
                <Card sx={{width : '40vw' , height : '30vh'}}>
                    <CardContent sx={{display : 'flex' , flexDirection : 'column' , alignItems : 'center' , gap:'3vh'}}>
                        <div>
                            Icon : 
                        {emojiOpen?<EmojiPicker onEmojiClick={handleEmojiClick}></EmojiPicker>:<IconButton onClick={()=>{setEmojiOpen(true)}}>{emoji}</IconButton>}
                        </div>
                        
                        <input type="text" value={name} onChange={handleChangeName} placeholder="enter name" style={{width : '100%' , placeContent : 'center'}}></input>
                        <button onClick={handleSubmit}>Submit</button>
                    </CardContent>
                    
                </Card>
            </Modal>
        </>
        
    )
}