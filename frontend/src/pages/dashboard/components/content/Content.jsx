import { useEffect, useState } from "react"
import KanbanStyleBoard from "../KanbanStyleBoard"
import NoteEditor from "../NoteEditor"
import { backendURL, send } from "../../../../global/request"

export default function Content({ view , data , databaseId}){
    const [contentData , setContentData] = useState(data)
    // useEffect(
    //     () => {
    //         send.get(backendURL + '/getContent' , {
    //             params : {
    //                 databaseId : databaseId
    //             }
    //         }).then(
    //             (res) => {
    //                 if(res.status == 200){
    //                     setContentData(res.data)
    //                 }
                    
    //             }
    //         )
    //         return (
    //             () => {
    //                 send.post(backendURL + '/saveData' , {
    //                     data : {
                           
    //                     }
    //                 })
    //             }
    //         )
    //     }
    // , [databaseId])
    switch( view ){
        case 'kanban':
            return (
                <KanbanStyleBoard data={contentData} ></KanbanStyleBoard>
            )
        case 'note':
            return(
                <NoteEditor data={contentData} databaseId={databaseId}></NoteEditor>
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
                <KanbanStyleBoard data={contentData}></KanbanStyleBoard>
            )
    }
}