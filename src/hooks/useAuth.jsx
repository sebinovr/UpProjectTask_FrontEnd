import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    //Extraer valores de AuthContext
    return useContext(AuthContext)
}

export default useAuth;