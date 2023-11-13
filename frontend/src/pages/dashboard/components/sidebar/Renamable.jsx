import { useState } from "react"

export default function RenamableName (  ) {
    const [ text , setText ] = useState('lokesh')
    const [ editable , setEditable ] = useState(true)
    const handleDoubleClick = () => {
        setEditable(!editable)
    }
    const handleKeyDown = (e) => {
        if(e.code == 'Enter'){
            setEditable(true)
        }
        console.log(e.code)
        console.log(e)
    }
    const handleChange = (e) => {
        setText(e.target.value)
    }
    return (
        editable?  (<span onDoubleClick={handleDoubleClick}>
            {text}
        </span>):
        (
            <input type="text" value={text} onChange={handleChange} autoFocus onKeyDown={handleKeyDown}></input>
        )    
    )
}