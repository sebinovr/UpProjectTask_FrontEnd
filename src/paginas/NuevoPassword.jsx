import { useEffect, useState } from "react"
import { Link, useParams} from 'react-router-dom'
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {

    const [password, setPassword] = useState('')
    const [tokenValido, setTokenValido] = useState(false);
    const [alerta, setAlerta] = useState({});
    const [passwordModificado, setPasswordModificado] = useState(false);

    const params = useParams();
    const {token} = params;
    
    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`);
                setTokenValido(true);
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true,
                })
            }
        }
        comprobarToken();
    }, [])

    
    const handleSubmit = async e => {
        e.preventDefault();

        //Comprobando si nueva contraseña es mayor a 6 dig
        if(password.length < 6){
            setAlerta({
                msg: "El password debe tener al menos 6 caracteres",
                error: true,
            })
            return
        }
        
        //Almacenando Password Nuevo
        try {
            const url = `/usuarios/olvide-password/${token}`
            const {data} = await clienteAxios.post(url, { password })
            setAlerta({
                msg: data.msg,
                error: false,
            })
            setPasswordModificado(true)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            });  
        }
    }

    const {msg} = alerta


    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize text-center my-3">Restablace tu <span className="text-gray-50">Password</span></h1>

            {msg && <Alerta alerta={alerta} />}

            {tokenValido && passwordModificado === false && (
                <form 
                    className="my-5 bg-white shadow rounded-lg px-5 py-5"
                    onSubmit={handleSubmit}>
                    <div className="mb-5" >
                        <label 
                            htmlFor="password"
                            className="uppercase text-gray-600 block text-xl font-bold"
                            >Nuevo Password:</label>
                        <input 
                            id="password"
                            type="password"
                            placeholder="Nuevo password de registro"
                            className="w-full mt-3 p-3 rounded-xl bg-gray-50"
                            value = {password}
                            onChange={e => setPassword(e.target.value)}/>
                    </div>

                    <input
                        type="submit"
                        value="Crear Cuenta"
                        className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-color">
                    </input>
                </form>
            )}

            {passwordModificado && (
                <Link
                    className="block text-center text-sm mt-5 uppercase text-white"
                    to="/"
                    >Inicia sesión
                </Link>                
            )}
        </>     
    )
}

export default NuevoPassword