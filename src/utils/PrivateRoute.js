import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = ({ children}) => {
    const { isLoggedIn } = useAuth();
    console.log("private route",isLoggedIn)
    if (isLoggedIn) {
      return <>{children}</>
    }else{
        return <Navigate to={"/login"}/>
    }
};