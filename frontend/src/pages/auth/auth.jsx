import GoogleLogger from "./components/GoogleLogin"
import GithubLogger from "./components/GithubLogin"
import LocalLogger from "./components/LocalLogin"
export default function Auth(){
    return (
        <>
            <LocalLogger></LocalLogger>
            <GoogleLogger></GoogleLogger>
            <GithubLogger></GithubLogger>
        </>
    )
}