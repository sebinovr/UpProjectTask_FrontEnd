import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client'
import useAuth from "../hooks/useAuth";

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] =useState({});
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate();

    //Para inicio de sesion
    const { auth } = useAuth();

    //PROYECTO **********************************************************
    //Pasar Proyectos para ser mostrados en pantalla
    useEffect(()=> {
        const obtenerProyectos = async ()=> {
            try{
                const token = localStorage.getItem('token');
                if(!token) return
                
                //Config Bearer Token
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios.get('/proyectos', config)
                setProyectos(data)
                
            } catch(error) {
                console.log(error)
            }

        }
        obtenerProyectos();
    }, [auth])

    //Conexion a socket.io
    useEffect(() => {
        socket= io(import.meta.env.VITE_BACKEND_URL)
    },[])
    

    //Para pasar alerta a FormularioProyecto
    const mostrarAlerta = alerta =>{
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({})
        }, 1500)
    }

    //FUNCION PARA ENVIAR PROYECTO A DB
    const submitProyecto = async proyecto => {

        if(proyecto.id){
            await editarProyecto( proyecto )
        } else {
            await nuevoProyecto( proyecto )
        }
    }


    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            //Sincornizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            //mostrar alerta           
            setAlerta({
                msg: "Proyecto Actualizado Correctamente",
                error: false,
            })

            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos')
            }, 1500);

        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            //Pasa Config Bearer Token para ser validado
            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            
            //Agregar ultima data de arreglo proyecto
            setProyectos([...proyectos, data]);
            
            setAlerta({
                msg: "Proyecto Creado Correctamente",
                error: false,
            })

            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos')
            }, 1500);

        } catch (error) {
            console.log(error)
            
        }
    }

    //Solo mostrar 01 proyecto seleecionado en pantalla principal
    const obtenerProyecto = async id => {

        setCargando(true)

        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            } 
            
            const { data } = await clienteAxios.get(`/proyectos/${id}`, config);
            setProyecto(data)
            setAlerta({})

        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.msg,
                error: true
            })

            setTimeout(() => {
                setAlerta({})
            }, 1500);
            
        } finally {
            setCargando(false)
        }

    }

    //Eliminar proyecto
    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            } 

            //Eliminar de DB
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
            
            //Sincronizar State
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id )
            setProyectos(proyectosActualizados)
            
            
            //Alerta de eliminado
            setAlerta({
                msg:data.msg,
                error: false,
            })

            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos')
            }, 1000);
        } catch (error) {
            console.log(error)
        }
    }

    //TAREAS*************************************************************
    //Modal Tarea
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    //Subtmit de Tarea
    const submitTarea = async tarea => {

        if(tarea?.id){
            await editarTarea(tarea)
        } else{
            await crearTarea(tarea)
        }
    }


    //Crear Tarea
    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            //Pasa Config Bearer Token para ser validado
            const { data } = await clienteAxios.post('/tareas', tarea, config)
            
            //Agrega tarea al State //Ahora es manejado por Socket.io
            // const proyectoActualizado = {...proyecto}
            // proyectoActualizado.tareas = [...proyecto.tareas, data]
            // setProyecto(proyectoActualizado)
            setAlerta({})
            setModalFormularioTarea(false)

            //Socket.io
            socket.emit('nueva tarea', data)

        } catch (error) {
            console.log(error)
        }    
    }

    //Editar Tarea
    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }        

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            
            //Se utiliza en Socket.io
            // const proyectoActualizado = {...proyecto} //copia de proyecto
            // proyectoActualizado.tareas = proyectoActualizado.tareas.map ( tareaState => tareaState._id === data._id ? data : tareaState )
            // setProyecto(proyectoActualizado)
            setAlerta({})
            setModalFormularioTarea(false)

            //Socket.io
            socket.emit('actualizar tarea', data)

        } catch (error) {
            console.log(error)
        }
    }

    const eliminarTarea = async () =>{
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }        

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            
            setAlerta({
                msg: data.msg,
                error: false
            })

            //Ahora controlado por Socket.io
            // const proyectoActualizado = {...proyecto} //copia de proyecto
            // proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
            // setProyecto(proyectoActualizado)
            setModalEliminarTarea(false)

            //Socket.io
            socket.emit('eliminar tarea', tarea)

            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 1500);

        } catch (error) {
            console.log(eliminar)
        }
    }


    //Para mostrar ModalEditarTarea
    const handleModalEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormularioTarea(true)
    }

    //Para mostrar ModalELiminarTarea
    const handleModalEliminarTarea = tarea => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea)
    }

    //COLABORADORES******************************************************

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }        

            const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            
            setColaborador(data)
            setAlerta({})


        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            })
        } finally {
            setCargando(false)
        }
    }


    const agregarColaborador = async email => {

        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }    
            
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            setAlerta({
                msg: data.msg,
                error:false
            }) 

            setTimeout(() => {
                setAlerta({})            
            }, 1500);


            setColaborador({})
            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            })
            
        }
    }

    //Modal Eliminar Colaborador
    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }    

            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id:colaborador._id}, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
            }, 1500);

        } catch (error) {
            console.log(error.response)
        }
    }

    
    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return
            
            //Config Bearer Token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            } 
            
            const{data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            
            // const proyectoActualizado = {...proyecto}
            // proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === data._id ? data : tareaState)
            // setProyecto(proyectoActualizado)
            setTarea({})
            setAlerta({})

            //Socket.io
            socket.emit('cambiar estado', data)

        } catch (error) {
            console.log(error.response)
        }
    }

    //BUSCADOR DE PROYECTOS***********************************************
    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //SOCKET IO***********************************************************
    //nueva tarea
    const submitTareasProyecto = (tarea) => {
        //Agrega tarea al State 
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    //eliminar tarea
    const eliminarTareaProyecto = (tarea) => {
        //Agrega tarea al State 
        const proyectoActualizado = {...proyecto} //copia de proyecto
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    //actualizar tarea
    const actualizarTareaProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto} //copia de proyecto
        proyectoActualizado.tareas = proyectoActualizado.tareas.map ( tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    //CERRAR SESION******************************************************
    const cerrarSesionProyectos = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});

    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos

            }}
        >{children}
        </ProyectosContext.Provider>                
    )
}

export{
    ProyectosProvider
}

export default ProyectosContext