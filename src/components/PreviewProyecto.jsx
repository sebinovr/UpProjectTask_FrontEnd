import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const PreviewProyecto = ({proyecto}) => {

    const { auth } = useAuth();

    const {nombre, _id, cliente, creador } = proyecto

    return (
        <div className="border-b p-5 flex flex-row justify-between items-center">
            <div className="flex flex-col items-start md:flex-row md:items-center gap-2">
                <p className="flex-1"> 
                    {nombre}
                </p>

                <p className="text-sm text-gray-500 uppercase" >
                    {cliente}
                </p>
                
                {auth._id !== creador ? 
                    <p className="p-1 text-xs rounded-lg text-white bg-green-500 font-bold uppercase "> Colaborador </p> :
                    <p className="p-1 text-xs rounded-lg text-white bg-sky-700 font-bold uppercase "> Administrador </p>

                }
            </div>

            <Link 
                to={`${_id}`}
                className="text-gray-500 hover:text-gray-800 uppercase text-sm font-bold"
            >Ver Proyecto</Link>
        </div>
    )
}

export default PreviewProyecto