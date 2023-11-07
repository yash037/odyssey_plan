import './auth.css';
import GithubIcon from '../../../assets/github.svg'

import { backendURL } from "../../../global/request"
export default function GithubLogger(){
    const handleGithubClick = () => {
        window.location.href = backendURL+'/auth/github';
    }
    return (
        <button onClick={handleGithubClick} className='github'>
            <img src={GithubIcon} alt="Github" className='githubimg' />
            GitHub
        </button>
    )
}