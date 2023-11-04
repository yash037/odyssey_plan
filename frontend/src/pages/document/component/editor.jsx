import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useCallback } from 'react'
import toolbarOptions from '../utils/toolBarOptions'

export default function TextEditor () {
    const callbackRef = useCallback(
        (wrapper) => {
            if( wrapper == null){
                return 
            }
            wrapper.innerHTML = ""
            const editor = document.createElement('div');
            wrapper.append(editor);
            new Quill( editor , { theme : 'snow',
            modules : {
                toolbar : toolbarOptions
            }
            } );
           
        }    
    )
    return (
        <div className="container" ref={callbackRef}></div>
    )
}