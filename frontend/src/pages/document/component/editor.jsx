import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useState } from 'react'
import toolbarOptions from '../utils/toolBarOptions'
import io from 'socket.io-client'
import { useParams } from 'react-router-dom'

export default function TextEditor () {
    const [ socket , setSocket ] = useState();
    const [ quill , setQuill ] = useState();
    const {id : documentId} = useParams(); //getting the document room id

    useEffect(()=>{ //effect that connect's the document browser with backend
        const socket = io("http://localhost:3001");
       
        setSocket(socket)
        return (
            () => {
                socket.disconnect()
            }
            
        )
    }    
    ,[])
    useEffect(() => {
        if(socket == null || quill == null){
            return ;
        }
        socket.once('load-document' , ( document ) => {
            quill.setContents(document);
            quill.enable();
        })
        socket.emit( 'join-document-room' , documentId )

    },[socket , quill, documentId])

    useEffect(() => {//effect to detect delta's and
        if( quill==null || socket == null ){
            return ; 
        } 
        const quillHandler = ( delta , oldDelta , source ) => { //
            if(source === 'user'){
                socket.emit( 'send-changes' , delta , documentId);
            }
        } 
        const socketHandler = (delta) => {
            quill.updateContents( delta );
        }

        quill.on('text-change' , quillHandler );
        socket.on('recieve-change' , socketHandler );

        return (
            () => {
                quill.off( 'text-change' , quillHandler )
                socket.off( 'recieve-change' , socketHandler )
            }
        )
    },[quill,socket])

    const callbackRef = useCallback( //effect to create the editor after the div named container is rendered
        (wrapper) => {
            if( wrapper == null){
                return 
            }
            wrapper.innerHTML = ""
            const editor = document.createElement('div');
            wrapper.append(editor);
            const q = new Quill( editor , { theme : 'snow',
                modules : {
                    toolbar : toolbarOptions
                }
            } );
            q.disable();
            q.setText('Loading ....')
            setQuill(q);
        }    
    , [])
    return (
        <div className="container" ref={callbackRef}></div>
    )
}