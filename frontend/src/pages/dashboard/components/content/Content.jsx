import { useEffect, useState } from "react"
import KanbanStyleBoard from "../KanbanStyleBoard"
import NoteEditor from "../NoteEditor"
import { backendURL, send } from "../../../../global/request"
import kanbanData from "./utils/kanbanData"
import noteData from "./utils/noteData"

export default function Content({ view , databaseId }){
    const [contentData , setContentData] = useState( view == 'board' ? kanbanData : noteData ) 
    const [ backendId , setBackendId ] = useState( databaseId )
    const [ componentType , setComponentType ] = useState( view )
    useEffect(
        () => { 
            setBackendId( databaseId )
        },[
            databaseId 
        ]
    )
    useEffect(
        () => {
            setComponentType(view)
        },
        [
            view
        ]
    )
    useEffect(
        () => {
          
            const getData = async ( databaseId ) => {
                const res = await send.get(backendURL + '/data/getContent' , { 
                    params : {
                        databaseId :databaseId
                    }
                })
               
                if(res.status == 200){
                    setContentData(res.data.data)
                    setComponentType(res.data.type)
                }
                if(res.status == 201){
                
                    switch(componentType){
                        case 'board' : 
                            setContentData(kanbanData)
                            break;
                        case 'note':
                            setContentData(noteData)
                            break;
                        
                    }
                }
                
            }
            getData(backendId)
           
          
        }
    , [backendId , componentType])
    
    switch( componentType ){
        case 'board':
            return (
                <KanbanStyleBoard 
                data={contentData} 
                databaseId={databaseId}
                key={databaseId}
                />
            )
        case 'note':
            return(
                <NoteEditor 
                data={contentData} 
                databaseId={databaseId}
                key={databaseId}
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
                <div>
                    we donn know
                </div>
            )
    }
}