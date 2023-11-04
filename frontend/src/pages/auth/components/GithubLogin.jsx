import { backendURL } from "../../../global/request"
export default function GithubLogger(){
    const handleGithubClick = () => {
        window.location.href = backendURL+'/auth/github';
    }
    return (
        <button onClick={handleGithubClick}>GitHub</button>
    )
}