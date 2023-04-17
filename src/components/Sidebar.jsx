import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Sidebar = () => {

    const {auth} = useAuth();


    return (
        <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-10 md:px-5 mt-5 md:pt-5">
            <p className="text-xl font-bold mb-3 md:mb-5">Hola: {auth.nombre}</p>

            <Link 
                to="crear-proyecto"
                className="text-white text-sm bg-sky-600 p-3 rounded-lg uppercase font-bold text-center"
                >Nuevo Proyecto    
            </Link>

        </aside>

    )
}

export default Sidebar