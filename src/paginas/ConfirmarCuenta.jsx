import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const ConfirmarCuenta = () => {

    const [alerta, setAlerta] = useState({})
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

    //Para leer lo que sale en el link
    const params = useParams();
    const { id } = params;

    useEffect(()=> {
        const confirmarCuenta = async () => {
            try {
                const url = `/usuarios/confirmar/${id}`
                const { data } = await clienteAxios(url)

                setAlerta({
                    msg: data.msg,
                    error:false,
                })

                setCuentaConfirmada(true)

            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error:true,
                })
            }
        }
        
        confirmarCuenta()

    },[])

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize text-center my-3">Confirma tu <span className="text-gray-50">Cuenta</span></h1>

            {msg && <Alerta alerta={alerta} />}
            
            {cuentaConfirmada && (
                <Link
                    className="block text-center text-sm mt-5 uppercase text-white"
                    to="/"
                    >Inicia sesión
                </Link>                
            )}

        </>   
    )
}

export default ConfirmarCuenta