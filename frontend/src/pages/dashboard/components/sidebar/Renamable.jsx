import { useState } from "react"

export default function RenamableName (  ) {
    const [ text , setText ] = useState('')
    const [ editable , setEditable ] = useState(false)
    const handleDoubleClick = () => {
        setEditable(!editable)
    }
    const handleKeyDown = (e) => {
        if(e.code == 'Enter'){
            setEditable(true)
        }
    }
    const handleChange = (e) => {
        setText(e.target.value)
    }
    return (
        editable?  (<span 
                    onDoubleClick={handleDoubleClick}
                    className="node-title-holder"
                    >
                        {text}
                    </span>
                    ):
                    (
                        <input 
                        type="text" 
                        value={text} 
                        onChange={handleChange} 
                        autoFocus 
                        onKeyDown={handleKeyDown} 
                        placeholder="enter name"
                        className="node-title-holder"
                        >

                        </input>
                    )    
    )
}