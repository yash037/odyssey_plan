import {send,frontendURL,backendURL} from '../../../global/request'
import { useState } from 'react';
export default function LocalLogger(){
    const [register,setRegister] = useState(true);
    const registerText = 'register'
    const loginText = 'sign in'
    const handleClick = () => {
        setRegister(!register);
    }
    return(
    <>
      
        {register==true?<LocalLoging></LocalLoging>:<LocalRegister></LocalRegister>}
        <button onClick={handleClick}>{register==true?registerText:loginText}</button>
    </>
    )
}
export function LocalRegister(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [verificationSent,setVerificationSent] = useState(false);
    const [verificationMessage,setVerificationMessage] = useState('');
    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData =  {
            username : username ,
            email : email ,
            password : password ,
        }
        const res = await send.post(backendURL+'/auth/register',{
            data : formData
        })
        if(res.status==200){
            setVerificationSent(true);
            setVerificationMessage(res.data);
        }
        else{
            setVerificationSent(true);
            setVerificationMessage(res.data);
        }
        console.log(res);
        setEmail('');
        setPassword('');
        setUsername('');
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    return (
        <div>
            <form action="/from" method="post" >
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required onChange={handleUsernameChange} value={username}/>
                <br/><br/>
                
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required onChange={handlePasswordChange} value={password}/>
                <br/><br/>
                
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required onChange={handleEmailChange} value={email}/>
                <br/><br/>
                {verificationSent&&<h1>{verificationMessage}</h1>}
                <input type="submit" value="Register" onClick={handleSubmit}/>
            </form>
        </div>
    )
}

export function LocalLoging(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [data,setData] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData =  {
            username : username ,
            password : password ,
        }
        const res = await send.get(backendURL + '/auth/local',{
            params : formData , 
        })  
       
        if(res.status==200){
            window.location.href = frontendURL
        }
        else{
            setData(res.data);
        }
    }
   
    const handleUsernameChange = (e) => {
        setData('')
        setUsername(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setData('')
        setPassword(e.target.value);
    }
    return (
        <div>
            <form action={backendURL+'/auth/local'} method="get" >
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required onChange={handleUsernameChange} value={username}/>
                <br/><br/>
                
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required onChange={handlePasswordChange} value={password}/>
                <br/><br/>
                {data}
                <input type="submit" value="Register" onClick={handleSubmit}/>
            </form>
        </div>
    )
}