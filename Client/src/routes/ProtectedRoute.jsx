import {Navigate , Outlet} from "react-router-dom";

const ProtectedRoute = () => {
    let token = localStorage.getItem("token");
    
    if(!token){
        return <Navigate to = "/login" />
    }

    return <Outlet/>
}

export default ProtectedRoute;