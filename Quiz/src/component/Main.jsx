import { useNavigate } from "react-router-dom"

function Main() {
    const navigate = useNavigate()
    const logout = () => {
        localStorage.clear()
        navigate('/')
    }
    return (
        <div>
            <h1>Main</h1>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Main