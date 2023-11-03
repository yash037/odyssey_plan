export default function GoogleLogger(){
    const handleGoogleClick = () => {
        window.location.href='http://localhost:8000/auth/google';
    }
    return (
        <div>
            <button onClick={handleGoogleClick}>Google</button>
        </div>
    )
}