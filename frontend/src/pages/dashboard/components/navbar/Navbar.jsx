import { send , backendURL , frontendURL} from '../../../../global/request'
import { useNavigate } from 'react-router-dom';
import '../css/Navbar.css'
import { Avatar } from '@mui/material';
export default function Navbar(){
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
    return (
        <div className='navbar'>
            <Avatar sx={{height:'90%' , margin:'0 1%' }}></Avatar>
        </div>
    )
}