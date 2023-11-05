import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useCallback, useEffect, useState } from 'react'
import toolbarOptions from '../utils/toolBarOptions'
import io from 'socket.io-client'
import { useParams } from 'react-router-dom'
import QuillCursors from 'quill-cursors';
import { useCookies } from 'react-cookie'
Quill.register('modules/cursors', QuillCursors);

export default function TextEditor () {
    const [ socket , setSocket ] = useState();
    const [ quill , setQuill ] = useState();
    const [ cursors , setCursors ] = useState();
    const {id : documentId} = useParams(); //getting the document room id
    const [ ownId , setOwnId ] = useState();
    const [ cookie ] = useCookies(['']);
    useEffect(
        () => {
            const id = cookie.userId;
            setOwnId(id);
            //console.log(id);
        }
        ,
        []
    )
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
        if(socket == null || quill == null || cursors == null){
            return ;
        }
        socket.once('load-document' , ( document , activeMembers ) => {
            quill.setContents(document);
            quill.enable();
            for(let i in activeMembers){
                 console.log(activeMembers[i])
                cursors.createCursor( activeMembers[i].Id , activeMembers[i].name , 'orange')
            }
        })
        const newMemberHandler = (memberId , name) => {
            if(memberId == ownId){
                
                return ;
            }
            cursors.createCursor(memberId , name , 'red')
        }
        const movementHandler = ( memberId , selection ) => {
           
            cursors.moveCursor(memberId , selection)
            console.log(cursors.cursors())
        }
        const memberLeftHandler = (memberId) => {
            cursors.removeCursor( memberId )
        }

        socket.emit( 'join-document-room' , documentId , ownId)
        socket.on( 'new-member-joined' , newMemberHandler)
        socket.on( 'member-left' ,  memberLeftHandler)
        socket.on( 'cursor-movement' , movementHandler)

        return (
            () => {
                socket.on( 'new-member-joined' , newMemberHandler)
                socket.on( 'member-left' ,  memberLeftHandler)
                socket.on( 'cursor-movement' , movementHandler)
            }
        )

    },[socket , quill, documentId , cursors])
    useEffect( //this effect save's the file before we unload 
        () => {
            if(socket == null || quill == null) {
                return
            }
            const handler = () => {
                socket.emit('save-document' , documentId , quill.getContents() );
                socket.emit( 'member-left' , documentId , ownId );
            }
            window.addEventListener('unload' , handler );
            window.addEventListener('beforeunload' , handler);
            return (
                () => {
                    window.removeEventListener('unload', handler);
                    window.removeEventListener('beforeunload' , handler)
                }
            )
        },
        [socket , quill]
    )
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
    },[quill , socket])

    useEffect(() => {
        if( quill == null || socket == null || cursors == null || ownId == null){
            return
        }
        const quillHandler = (selectNew , selectOld , source) => {
            
                const selection = quill.getSelection();
                socket.emit('cursor-movement', documentId , ownId , selection)
                
        }
        quill.on('selection-change' , quillHandler)

        return(() => {
            quill.off('selection-change' , quillHandler);
        })
    }, [quill , socket , cursors , ownId])
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
                    toolbar : toolbarOptions,
                    cursors : true ,
                }
            } );
            q.disable();
            q.setText('Loading ....')
            setQuill(q);
            const c = q.getModule('cursors');
            setCursors(c);
        }    
    , [])
    return (
        <div className="container" ref={callbackRef}></div>
    )
}