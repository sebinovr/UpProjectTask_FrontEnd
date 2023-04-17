import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";

const FormularioProyecto = () => {

    const [id, setId] =useState(null)
    const [nombre, setNombre] = useState();
    const [descripcion, setDescripcion] = useState();
    const [fechaEntrega, setFechaEntrega] = useState();
    const [cliente, setCliente] = useState();

    //Para identificar si para edicion de proyectos 
    const params = useParams();

    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

    //Para autocompletar campos en EditarProyecto
    useEffect(()=> {
        if(params.id && proyecto.nombre){
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]) //Elimina parte del formato fecha
            setCliente(proyecto.cliente)
        } else {

        }
    }, [params])


    const handleSubmit = async e => {
        e.preventDefault();

        if([nombre, descripcion, fechaEntrega, cliente].includes('')){
            mostrarAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            })
            return
        }

        //Pasar los datos hacia el Provider
        await submitProyecto({id, nombre, descripcion, fechaEntrega, cliente });

        //Limpiar formulario
        setId(null)
        setNombre('');
        setDescripcion('');
        setFechaEntrega('');
        setCliente('');
    }

    const { msg } = alerta 
    

    return (
        <form 
            className="bg-white py-10 px-5 md:w-2/3 rounded-lg shadow-lg"
            onSubmit={handleSubmit}>

            { msg && <Alerta alerta={alerta} />}

            <div className="mb-5 flex flex-col">
                <label className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="nombre"
                >Nombre:</label>

                <input
                    id="nombre"
                    type="text"
                    className="border w-full- mt-2 p-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre de Proyecto"
                    value={nombre}
                    onChange={ e => setNombre(e.target.value)}
                    />
            </div>

            <div className="mb-5 flex flex-col">
                <label className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="descripcion"
                >Descripción:</label>

                <textarea
                    id="descripcion"
                    className="border w-full- mt-2 p-2 placeholder-gray-400 rounded-md"
                    value={descripcion}
                    onChange={ e => setDescripcion(e.target.value)}
                    />
            </div>

            <div className="mb-5 flex flex-col">
                <label className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="fecha-entrega"
                >Fecha de entrega:</label>

                <input
                    id="fecha-entrega"
                    type="date"
                    className="border w-full- mt-2 p-2 placeholder-gray-400 rounded-md text-gray-500"
                    value={fechaEntrega}
                    onChange={ e => setFechaEntrega(e.target.value)}
                    />
            </div>

            <div className="mb-5 flex flex-col">
                <label className="text-gray-700 uppercase font-bold text-sm"
                        htmlFor="cliente"
                >Cliente:</label>

                <input
                    id="cliente"
                    type="text"
                    className="border w-full- mt-2 p-2 placeholder-gray-400 rounded-md"
                    placeholder="Cliente"
                    value={cliente}
                    onChange={ e => setCliente(e.target.value)}
                    />
            </div>

            <input
                type="submit"
                value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-800 transition-colors"
            />
        </form>    
    )
}

export default FormularioProyecto