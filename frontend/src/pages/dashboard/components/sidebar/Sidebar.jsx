import RecursiveSidebar from "./RecursiveFileExplorer";
import '../css/Sidebar.css'


export default function Sidebar({setContent }){
    
    return (
        <div className="sidebar-div">
                <RecursiveSidebar 
                index={0} 
                setContent={setContent}
                name={'personal space'}
                ></RecursiveSidebar>
        </div> 
    )
}