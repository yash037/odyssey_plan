import { send , backendURL , frontendURL} from '../../global/request'
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Box from "@mui/material/Box";
import Navbar from "./Navbar"

export default function DashBoard(){
    const history = useNavigate()
    const handleLogout = () => {
        send.get(backendURL+'/auth/logout').then(
            (res)=>{
                if(res.status==200){
                    console.log('logining out');
                    window.location.href = frontendURL;
                }
                else{
                    console.log('logout failed')
                }

            }
        )
    }
    const handleDocument = () => {
       history('/documents')
    }

    return (
        // <div className='message'>
        //     <p>If you are seeing this, you are logged in</p>
        //     <button onClick={handleLogout} >Logout</button>
        //     <button onClick={handleDocument} >Go to Document</button>
        // </div>

        <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <button onClick={handleLogout} >Logout</button>
          <button onClick={handleDocument} >Go to Document</button>
        </Box>
      </div>


    )
}