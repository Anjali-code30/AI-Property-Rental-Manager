import {Navigate , Outlet} from "react-router-dom";

const dashBoardByRole = {
  user: "/user/dashboard",
  owner: "/owner-dashboard",
  admin: "/admin-dashboard",
};

const UserRoute = () => {
    let token = localStorage.getItem("token");
    let role = localStorage.getItem("role");
    
    if(!token){
        return <Navigate to = "/login" />
    }
    if(role !== "user"){
        return <Navigate to={dashBoardByRole[role] || "/login"} />
    }
//    when we are returnig outlet means we are saying it is a vaild user so you can run its nested route and rediect it to the userDashbord
    return <Outlet/>
}

export default UserRoute;