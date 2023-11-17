import AddCircle from "@mui/icons-material/AddCircle";
import { CardActions, CardContent, IconButton, Modal } from "@mui/material";
import { Card } from "antd";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import TextArea from "./TextArea";
import { BlockPicker } from 'react-color'
export default function AddLabelModal({ setBoardMetaData }){
    const [ open , setOpen ] = useState(false)
    const [ name , setName ] = useState('')
    const [ emoji , setEmoji ] = useState('😴')
    const [ description , setDescription ] = useState('')
    const [ color , setColor ] = useState('#FF213F')
    const [ emojiOpen , setEmojiOpen ] = useState(false)
    const handleAddClick = () => {
        setOpen(true)
    }
    const handleModalClose = () => {
        setOpen(false)
    }
    const handleNameChange = ( e ) => {
        setName(e.target.value)
    }
    const handleNameSubmit = () => {
        //add label here id emoji and name and color description
        
        setBoardMetaData((data)=> ({...data , label : [...data.label , {data : 'asd' , emoji : '🤗'}]}))
        handleModalClose()
    }
    const handleEmojiClick = (e) => {
        console.log(e)
        setEmoji(e.emoji)
        setEmojiOpen(false)
    }
    const handleColorChange = (color) => {
        console.log(color)
        setColor(color.hex)
    }
       return(
        <div>
            <IconButton onClick={handleAddClick} sx={{ color : 'black',fontSize : '16px'}}>
                <AddCircle sx={{color : 'gold' , marginRight : '4px'}}>

                </AddCircle>
                Create Custom Label
            </IconButton>
            <Modal
                onClose={handleModalClose}
                open={open}
            >
                <div className="add-board-modal">
                    <Card>
                        <CardContent>
                            <input value={name} onChange={handleNameChange} placeholder="enter name here"></input>
                            Emoji : {emojiOpen ? <div style={{height : '10px'}}><EmojiPicker onEmojiClick={handleEmojiClick} height={'50vh'} width={'20vw'}/> </div>: <div onClick={() => {setEmojiOpen(true)}} style={{fontSize : '30px'}}>{emoji}</div>}
                            <TextArea 
                            value={description} 
                            setText={setDescription}
                            >

                            </TextArea>
                            <BlockPicker 
                            onChangeComplete={handleColorChange}
                            color={color}
                            >

                            </BlockPicker>
                        </CardContent>
                        <CardActions>
                            <button onClick={handleNameSubmit}>Create</button>
                        </CardActions>
                    </Card>   
                </div>
                
            </Modal>
        </div>
       )
}