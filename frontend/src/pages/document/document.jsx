import TextEditor from './component/Editor'
import './documentStyles.css'
import {  BrowserRouter ,Routes , Route , Navigate} from 'react-router-dom'

import {v4 as uuid} from 'uuid'
import { frontendURL } from '../../global/request'
export default function DocumentEditor () {
  
    return ( 
        <BrowserRouter>
             <Routes>
                <Route path='/' exact element={<Redirect></Redirect>}>  
                </Route>
                <Route path='/documents/:id' exact element={<TextEditor></TextEditor>} /> 
            </Routes>
        </BrowserRouter>
        
        
    )
}

function Redirect ( ){

    return (
        <Navigate to={`/documents/${uuid()}`}></Navigate>
    )
}