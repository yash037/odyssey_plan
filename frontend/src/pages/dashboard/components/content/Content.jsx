import KanbanStyleBoard from "../KanbanStyleBoard"
import NoteEditor from "../NoteEditor"

const kanbanData = [
    {
        name : 'unassigned',
        data : [
            {
                id : '1',
                name : 'unassigned'
            }
        ],
    },
    {
        name : 'assigned',
        data : [
            {
                id : '2',
                name : 'assigned'
            }
        ],
    },
    {
        name : 'done',
        data : [
            {
                id : '3',
                name : 'done'
            }
        ],
    },
    {
        name : 'archived',
        data : [
            {
                id : '4',
                name : 'archived'
            }
        ],
    },
    {
        name : 'unarchived',
        data : [
            {
                id : '5',
                name : 'unarchived'
            }
        ]
    }
]
export default function Content({ view , data , databaseId}){
    switch( view ){
        case 'kanban':
            return (
                <KanbanStyleBoard data={kanbanData}></KanbanStyleBoard>
            )
        case 'note':
            return(
                <NoteEditor></NoteEditor>
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
                <KanbanStyleBoard data={kanbanData}></KanbanStyleBoard>
            )
    }
}