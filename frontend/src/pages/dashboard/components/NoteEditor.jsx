import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { v4 as uuid } from "uuid";
import { send } from '../../../global/request'
import "@blocknote/core/style.css";


export default function NoteEditor() {
  
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
    }
  });

  return <BlockNoteView editor={editor} theme={'dark'}/>;
}