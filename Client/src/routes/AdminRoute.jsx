import {Navigate , Outlet} from "react-router-dom";

const dashBoardByRole = {
  user: "/user/dashboard",
  owner: "/owner-dashboard",
  admin: "/admin-dashboard",
};

const AdminRoute = () => {
    let token = localStorage.getItem("token");
    let role = localStorage.getItem("role");
    
    if(!token){
        return <Navigate to = "/login" />
    }
    if(role !== "admin"){
        return <Navigate to={dashBoardByRole[role] || "/login"} />
    }

    return <Outlet/>
}

export default AdminRoute;
