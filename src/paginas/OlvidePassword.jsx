import {useState } from 'react'
import {Link} from 'react-router-dom'
import clienteAxios from '../config/clienteAxios';
import Alerta from '../components/Alerta';


const OlvidePassword = () => {

    const [email, setEmail] = useState('');
    const [alerta, setAlerta] = useState({})

    const handleSubmit = async e => {
        e.preventDefault();

        //Validacion
        if(email === '' && email.length < 6 ){
            setAlerta({
                msg: "El email es obligatorio",
                error: true
            })
            return
        }

        try {
            //TODO: Mover hacia un cliente Axios
            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })
            console.log(data)
            setAlerta({
                msg: data.msg,
                error:false,
            })     

        } catch (error) {
            console.log(error.response)
            setAlerta({
                msg: error.response.data.msg,
                error:true,
            })
        }


    }

    const {msg} = alerta

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize text-center my-3">Recupera tu <span className="text-gray-50">Password</span></h1>

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
                        onChange={ e => setEmail(e.target.value)}/>
                </div>

                <input
                    type="submit"
                    value="Enviar instrucciones"
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
                    to="registrar"
                    >¿No tienes una cuenta? Resgistrate
                </Link>
            </nav>
        </>

)
}

export default OlvidePassword