import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {

    const navigate = useNavigate()

    const user = useSelector((state) => state.user.isAuthenticated)

    const location = useLocation()

    if(!user){
        return navigate('/login', { replace: true, state: { redirect: location }})
    }else{
        return children
    }
}

export default ProtectedRoute