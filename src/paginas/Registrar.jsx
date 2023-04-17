import { Link } from 'react-router-dom'
import { useState } from 'react'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';
const Registrar = () => {

    //Variables de formulario
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');

    //Alerta de error
    const [ alerta, setAlerta] = useState({})

    //Comprobacion de campos
    const handleSubmit = async e => {
        e.preventDefault();

        //COmprobar si hay campos vacios
        if([nombre, email, password, repetirPassword].includes('')){
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true,
            })
            return 
        } 
        
        //Comprobar si contraseñas coinciden 
        if(password !== repetirPassword){
            setAlerta({
                msg: "Los passwords no son iguales",
                error: true,
            })
            return 
        } 

        //Comprobar minimo de longitud de caracteres 
        if(password < 6){
            setAlerta({
                msg: "Password debe contener almenos 6 caracteres",
                error: true,
            })
            return 
        } 

        //Resetear variable
        setAlerta({})

        //conectar a DB y crea usuario en API
        try {
            const {data} = await clienteAxios.post(`/usuarios`, {nombre, email, password})
            setAlerta({
                msg: data.msg,
                error:false,
            })

            setNombre('');
            setEmail('');
            setPassword('');
            setRepetirPassword('');

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error:true,
            })
        }
    }

    //Para utilizar msg 
    const { msg } = alerta

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize text-center my-3">Crea tu <span className="text-gray-50">Cuenta</span></h1>

            {/* Mostrar Alerta se pasa hijo Alerta desde components */}
            { msg && <Alerta alerta={alerta} />}

            <form 
                className="my-5 bg-white shadow rounded-lg px-5 py-5"
                onSubmit={handleSubmit}>
                <div className="mb-5" >
                    <label 
                        htmlFor="nombre"
                        className="uppercase text-gray-600 block text-xl font-bold"
                        >Nombre:</label>
                    <input 
                        id="nombre"
                        type="text"
                        placeholder="Nombre de registro"
                        className="w-full mt-3 p-3 rounded-xl bg-gray-50"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        />
                </div>

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
                        onChange={e => setEmail(e.target.value)}
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
                        onChange={e => setPassword(e.target.value)}
                        />
                </div>

                <div className="mb-5" >
                    <label 
                        htmlFor="password2"
                        className="uppercase text-gray-600 block text-xl font-bold"
                        >Repetir Password:</label>
                    <input 
                        id="password2"
                        type="password"
                        placeholder="Repite tu password"
                        className="w-full mt-3 p-3 rounded-xl bg-gray-50"
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)}
/>
                </div>

                <input
                    type="submit"
                    value="Crear Cuenta"
                    className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-color">
                </input>
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center mt-2 text-slate-500 uppercase text-sm"
                    to="/"
                    >¿Ya tienes una cuenta? Inicia sesión
                </Link>

                <Link
                    className="block text-center mt-2 text-slate-500 uppercase text-sm"
                    to="/olvide-password"
                    >¿Olvidaste tu password? 
                </Link>
            </nav>
        </>    
    )
}

export default Registrar