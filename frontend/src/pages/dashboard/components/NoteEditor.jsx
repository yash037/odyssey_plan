
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { v4 as uuid } from "uuid";
import { backendURL, send } from '../../../global/request'
import "@blocknote/core/style.css";
import { useEffect, useState } from "react";
import { backdropClasses } from "@mui/material";

const demo = '### this is a heading some data'
export default function NoteEditor({data , databaseId}) {
    const  [ markdown , setMarkdown ] = useState( demo ) 
    const saveBlocksAsMarkdown = async (editor) => {
      const newMarkdown = await editor.blocksToMarkdown(editor.topLevelBlocks);
      setMarkdown(newMarkdown);
    };
    const editor = useBlockNote({
      uploadFile : async (uploadFile) => {
          const formData = new FormData();
          formData.append('file', uploadFile);

          const id = uuid()
          const res = await send.post('http://localhost:3002/serve/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
            ,
            params : {
              id : id
            }
          })
          console.log(res.data)
          return `http://localhost:3002/serve${res.data.endpoint}?id=${res.data.path}`
        },
      onEditorContentChange : (editor) => {
        saveBlocksAsMarkdown(editor)
      },
      onEditorReady : async () => {
        const data = await editor.markdownToBlocks(markdown)
        editor.replaceBlocks(editor.topLevelBlocks, data )
      }
  })
  useEffect(()=>{
      return(
        ()=>{
          send.post(backendURL + '/saveData' , {
             data : {
                databaseId : databaseId,
                markdown :  markdown,
                filetype :  'note',
             }
          })
        }
      )
  },[])
  
 

  return (
    <>
    <BlockNoteView 
    editor={editor} 
    theme={'dark'}
    />
    
  </>
  )
          
}