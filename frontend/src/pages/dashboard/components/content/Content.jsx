import { useEffect, useState } from "react"
import KanbanStyleBoard from "../KanbanStyleBoard"
import NoteEditor from "../NoteEditor"
import { backendURL, send } from "../../../../global/request"
import kanbanData from "./utils/kanbanData"
import noteData from "./utils/noteData"

export default function Content({ view , data , databaseId }){
    const [contentData , setContentData] = useState(data)
    useEffect(
        () => {
            
        },
        [contentData,databaseId]
    )
    useEffect(
        () => {
            send.get(backendURL + '/data/getContent' , {
                params : {
                    databaseId : databaseId
                }
            }).then(
                (res) => {
                    console.log(res)
                    if(res.status == 200){
                        setContentData(res.data)
                    }
                    if(res.status == 201){
                        switch(view){
                            case 'board' : 
                                setContentData(kanbanData)
                                break;
                            case 'note':
                                setContentData(noteData)
                                break;
                            
                        }
                    }
                }
            )   
        }
    , [databaseId,view])
    
    switch( view ){
        case 'board':
            console.log(contentData)
            return (
                <KanbanStyleBoard 
                data={contentData} 
                databaseId={databaseId}
                />
            )
        case 'note':
            return(
                <NoteEditor 
                data={contentData} 
                databaseId={databaseId}
                />
            )
        case 'doc':
            return(
                <div>
                    go to see the doc link
                    or show some data here
                </div>
            )
        case 'calendar':
            return(
                <div>
                    go to see the calendar link
                    or show some data here
                </div>
            )
        default :
            return (
                <KanbanStyleBoard 
                data={contentData} 
                databaseId={databaseId}
                />
            )
    }
}