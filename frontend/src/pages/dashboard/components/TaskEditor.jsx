import CapsuleButton from "./CapsuleButton"
import { Card , CardActions ,CardHeader , CardContent , IconButton  , TextField, ButtonGroup, MenuItem } from '@mui/material'
import TextArea from './TextArea'
import Input  from "./Input";
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import SupportIcon from '@mui/icons-material/Support';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import DropdownMenu from "./DropdownMenu";
import Calendar from './CalanderStyled'
import { useState } from "react";

//done for modularity
const priorityData = ['procrastinate' , 'low' , 'medium' , 'high']; //array of priority
const kanbanData = ['Backlog' , 'Doing' , 'Review' , 'Done']; // array of kanban 
const colors = [ 'red' , 'yellow' , 'blue' , 'green' , 'purple' , 'pink']; //array of colors

export default function TaskEditor({handleClose = () => {}}){
  const [date , setDate ] = useState(null);
  const [ priority , setPriority ] = useState(0);
  const [ kanban , setKanban ] = useState(0);
  const [ title , setTitle ] = useState('');
  const [text , setText ] = useState('');
  const [anchorCal, setAnchorCal] = useState(null);
  const [anchorFlag , setAnchorFlag] = useState(null);
  const [anchorKanban , setAnchorKanban] = useState(null);

  const handleMenuItemClick = ( stateSetter , anchorSetter , index ) => {
    stateSetter(index);
    anchorSetter(null);
  }
  const handleCreateClick = () => {
    setDate()
    setPriority(0)
    setKanban(0)
    setTitle(0)
    setText(0)
  }
  return (
    
        <Card  sx={{height:'50vh', width: '30vw' , position : 'absolute' , left : '0' , top : '0'}}>
            <CardHeader
                subheader={<Input placeholder={'Type Here'} setInput={setTitle} value={title}></Input>}
                action = {<IconButton onClick={handleClose}><CloseIcon></CloseIcon></IconButton>}
            />
            <CardContent>
                <div>
                    In    <div style={{display:'inline' , margin:'10%'}}><CapsuleButton> Something</CapsuleButton> </div>       For    <div style={{display:'inline' , marginLeft:'10%'}}><CapsuleButton> Something</CapsuleButton> </div>
                </div>
                <div>
                    <TextArea setText={setText} value={text}></TextArea>
                </div>
            </CardContent>
            <CardActions>
                <ButtonGroup>
                    <DropdownMenu icon={<CalendarMonthIcon style={{color : 'green'}}/>} popUp={true} anchorEl={anchorCal} setAnchorEl={setAnchorCal}>
                        <MenuItem>
                           <Calendar date={date} setDate={(e) => {
                            setDate(e)
                            setAnchorCal(null);
                           }}/>
                        </MenuItem>
                    </DropdownMenu>
                    <DropdownMenu icon={<FlagIcon style={{color : 'purple'}}/>} popUp={true} anchorEl={anchorFlag} setAnchorEl={setAnchorFlag}>
                        {
                           priorityData.map(( data , index ) => {
                                return (
                                    <MenuItem key={`p${index}`} onClick={()=>{
                                        handleMenuItemClick(setPriority,setAnchorFlag,index)
                                    }}>
                                        <FlagIcon  style={{color : colors[index]}}/>
                                        {data}
                                    </MenuItem>
                                )
                            })
                        }
                                  
                    </DropdownMenu>
                    <DropdownMenu icon={<SupportIcon style={{color : 'red'}}/>} popUp={true} anchorEl={anchorKanban} setAnchorEl={setAnchorKanban}>
                        {
                            kanbanData.map(( data , index ) => {
                                return (
                                    <MenuItem key={`k${index}`} onClick = { () => {handleMenuItemClick(setKanban,setAnchorKanban,index)}}>
                                        <FlagIcon  style={{color : colors[index]}}/>
                                        {data}
                                    </MenuItem>
                                )
                            })
                        }
                                
                    </DropdownMenu>
                    
                </ButtonGroup>
                <IconButton sx={{position : 'absolute' , right : '2vw' ,color : 'gold'}} onClick={ ()=> {
                    handleCreateClick();
                    handleClose();
                }}>
                    <AddCircleIcon ></AddCircleIcon>
                </IconButton>
            </CardActions>
        </Card>
   
    
  );
}



