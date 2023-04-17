//Se debe importar AuthProvider a App.jsx
//Se debe importar AuthContext a hooks useAuht.jsx

import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ( {children} ) => {

    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    //Para usuarios que ya se encuentran autenticados muchas veces 
    const navigate = useNavigate()

    useEffect(()=> {
        const autentificarUsuario = async () => {
            const token = localStorage.getItem('token');
            if(!token){
                setCargando(false);
                return
            }

            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                //Pasa Config Bearer Token para ser validado
                const { data } = await clienteAxios.get('/usuarios/perfil', config)
                setAuth(data)
                //Redirecciona si usuarios ya tiene guardado su usuario
                navigate('/proyectos')
            } catch (error) {
                setAuth({})
            }           
            setCargando(false)
        }
        autentificarUsuario()
    }, [])

    //Cerrar sesion
    const cerrarSesionAuth = () => {
        setAuth({})
    }
    
    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}

        </AuthContext.Provider>
    )
}


export {
    AuthProvider
}

export default AuthContext;
