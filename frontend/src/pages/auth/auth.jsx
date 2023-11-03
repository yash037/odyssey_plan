import GoogleLogger from "./components/GoogleLogin"
import GithubLogger from "./components/GithubLogin"
export default function Auth(){
    return (
        <>
            <GoogleLogger></GoogleLogger>
            <GithubLogger></GithubLogger>
        </>
    )
}