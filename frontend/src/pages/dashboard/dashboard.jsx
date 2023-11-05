import { send , backendURL , frontendURL} from '../../global/request'
import { useNavigate } from 'react-router-dom';
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
        <div>
            If you are seeing this you are logged in 
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleDocument}>Go to Doucment</button>
        </div>
    )
}