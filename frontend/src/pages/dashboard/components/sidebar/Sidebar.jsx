import RecursiveSidebar from "./RecursiveFileExplorer";
import '../css/Sidebar.css'


export default function Sidebar({setContent , setFiles , files}){
    
    return (
        <div className="sidebar-div">
                <RecursiveSidebar 
                setFiles={setFiles}
                files={files}
                index={0} 
                setContent={setContent}
                name={'personal space'}
                ></RecursiveSidebar>
        </div> 
    )
}