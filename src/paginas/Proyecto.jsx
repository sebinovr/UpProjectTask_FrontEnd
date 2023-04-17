import { useEffect } from "react";
import { useParams, Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import Tarea from "../components/Tarea";
import Alerta from "../components/Alerta";
import Colaborador from "../components/Colaborador";
import io from 'socket.io-client'

let socket;

const Proyecto = () => {

    const params = useParams();

    const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea} = useProyectos();
    const admin = useAdmin();

    //Se busca proyecto con el id del url 
    useEffect(()=>{
        obtenerProyecto(params.id)
    }, [])

    //Socket.io useEffect
    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('abrir proyecto', params.id)
    },[])

    useEffect(()=>{
        socket.on('tarea agregada', tareaNueva => {
            if(tareaNueva.proyecto === proyecto._id){
                submitTareasProyecto(tareaNueva)
            }
        });

        socket.on('tarea eliminada', tareaEliminada =>{
            if(tareaEliminada.proyecto === proyecto._id){
                eliminarTareaProyecto(tareaEliminada)
            }
        });

        socket.on('tarea actualizada', tareaActualizada =>{
            if(tareaActualizada.proyecto._id === proyecto._id){
                actualizarTareaProyecto(tareaActualizada)
            }
        });


        socket.on('nuevo estado', nuevoEstadoTarea =>{
            if(nuevoEstadoTarea.proyecto._id === proyecto._id){
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        });
    })


    const { nombre } = proyecto
    if(cargando) return 'Cargando...'
    const { msg } = alerta

    return (

            <>
            <div className="flex justify-between">
                <h1 className="text-3xl font-black">{nombre}</h1>

                { admin && (    
                <div className="flex items-center gap-2 text-gray-400 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                
                    <Link
                        to={`/proyectos/editar/${params.id}`}
                        className="uppercase font-bold"
                    >Editar</Link>
                </div>
                )}
            </div>
                
                {admin && (
                <button
                    type="button"
                    className="flex text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 gap-2 items-center justify-center"            
                    onClick={ handleModalTarea }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nueva Tarea
                </button>
                )}

                <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

                <div className="flex justify-center">
                    <div>
                        {msg && <Alerta alerta={alerta}/>}
                    </div>
                </div>

                <div className='bg-white shadow mt-5 rounded-lg'>
                    {proyecto.tareas?.length >0 ? 
                    proyecto.tareas?.map( tarea => (
                        <Tarea 
                        key={tarea._id}
                        tarea={tarea}
                        />
                    )) : 
                    <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
                </div>

                { admin && (
                    <>
                        <div className="flex items-center justify-between mt-10">
                            <p className="font-bold text-xl">Colaboradores del Proyecto</p>
                            <Link 
                                to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                                className="text-gray-400 hover:text-black uppercase font-bold"
                            >Añadir</Link>
                        </div>

                        <div className='bg-white shadow mt-5 rounded-lg'>
                            {proyecto.colaboradores?.length >0 ? 
                            proyecto.colaboradores?.map( colaborador => (
                                <Colaborador
                                    key={colaborador._id}
                                    colaborador={colaborador}
                                />
                            )) : 
                            <p className='text-center my-5 p-10'>No hay colaboradores en este proyecto</p>}
                        </div>
                    </>
                )}

                <ModalFormularioTarea/>
                <ModalEliminarTarea/>
                <ModalEliminarColaborador/>
            </>
        )    
}

export default Proyecto