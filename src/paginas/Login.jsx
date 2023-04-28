import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/useAuth' 


const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alerta, setAlerta] = useState({})
    
    //Extrae funcion desde provider
    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async e =>{
        e.preventDefault();

        if([email, password].includes('')){
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true,
            })
            return
        }

        //Autentificar el usuario
        try {
            const { data } = await axios.post('https://up-project-task.onrender.com/api/usuarios/login', {email, password})
            /** Almacenamiento en LOCALSTORAGE */
            setAlerta({})
            localStorage.setItem('token', data.token)

            setAuth(data)
            navigate('/proyectos')

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            })
        }

    }

    const { msg } = alerta


    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize text-center my-3">Administra <span className="text-gray-50">proyectos</span></h1>

            {msg && <Alerta alerta={alerta} />}
            <form 
                className="my-5 bg-white shadow rounded-lg px-5 py-5"
                onSubmit={handleSubmit}
                >
                <div className="mb-5" >
                    <label 
                        htmlFor="email"
                        className="uppercase text-gray-600 block text-xl font-bold"
                        >Email:</label>
                    <input 
                        id="email"
                        type="email"
                        placeholder="Email de registro"
                        className="w-full mt-3 p-3 rounded-xl bg-gray-50"
                        value={email}
                        onChange={ e => setEmail(e.target.value) }
                        />
                </div>

                <div className="mb-5" >
                    <label 
                        htmlFor="password"
                        className="uppercase text-gray-600 block text-xl font-bold"
                        >Password:</label>
                    <input 
                        id="password"
                        type="password"
                        placeholder="Password de registro"
                        className="w-full mt-3 p-3 rounded-xl bg-gray-50"
                        value={password}
                        onChange={ e => setPassword(e.target.value) }
                        />
                </div>

                <input
                    type="submit"
                    value="Iniciar Sesión"
                    className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-color">
                </input>
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center mt-2 text-slate-500 uppercase text-sm"
                    to="registrar"
                    >¿No tienes una cuenta? Resgistrate
                </Link>

                <Link
                    className="block text-center mt-2 text-slate-500 uppercase text-sm"
                    to="olvide-password"
                    >¿Olvidaste tu password? 
                </Link>
            </nav>
        </>

    )
}

export default Login