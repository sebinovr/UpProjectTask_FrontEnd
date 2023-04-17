import { Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import useAuth from "../hooks/useAuth"
import Busqueda from "./Busqueda"

const Header = () => {

    const { handleBuscador, cerrarSesionProyectos} = useProyectos()
    const { cerrarSesionAuth } = useAuth()

    //Cerrar Sesion
    const handleCerrarSesion = () => {
        cerrarSesionAuth();
        cerrarSesionProyectos();
        //Resetear Token del localStorage
        localStorage.removeItem("token");
    }

    return (
        <header className="px-5 py-5 md:py-7 bg-white border-b md:flex md:justify-between">
            <div>
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">UpTask</h2>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-5">
                <button
                    type="button"
                    className="font-bold uppercase"
                    onClick={handleBuscador}
                >Buscar Proyecto</button>

                <Link 
                    to="/proyectos"
                    className="font-bold uppercase"
                    >Proyectos
                </Link>

                <button
                    type="button"
                    className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold"
                    onClick={handleCerrarSesion}    
                >
                    Cerrar Sesión
                </button>

                <Busqueda />
            </div>

        </header>
    )
}

export default Header