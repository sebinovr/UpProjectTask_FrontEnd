import { useContext } from "react";
import ProyectosContext from "../context/ProyectosProvider";

const useProyectos = () => {
    //Extraer valores de ProyectosContext
    return useContext(ProyectosContext)
}

export default useProyectos;