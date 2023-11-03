import { send , backendURL , frontendURL} from '../../global/request'

export default function DashBoard(){
    const handleLogout = () => {
        send.get(backendURL+'/logout').then(
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
        <div>
            If you are seeing this you are logged in 
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}