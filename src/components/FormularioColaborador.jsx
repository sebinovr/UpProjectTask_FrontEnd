import { useState } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

const FormularioColaborador = () => {

  const [email, setEmail] = useState('')

  const {mostrarAlerta, alerta, submitColaborador} = useProyectos();

  const handleSubmit = e => {
    e.preventDefault()

    if(email === ''){
      mostrarAlerta({
        msg: "El email es obligatorio",
        error: true
      })
      return
    }

    submitColaborador(email)
    
  }

  const {msg} = alerta

  return (
    <form className="bg-white py-5  w-full md:w-1/2 rounded-lg shadow p-5"
          onSubmit={handleSubmit}>

      {msg && <Alerta alerta={alerta}/>}      
      
      <div className='mb-5'>
          <label
              className='text-gray-700 uppercase font-bold text-sm'
              htmlFor='email'
          >
              Email Colaborador:
          </label>

          <input
              type='email'
              id='email'
              placeholder='Email del colaborador'
              className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
              value={email}
              onChange={ e => setEmail(e.target.value)}
          />

          <input 
            type="submit"
            className='bg-sky-600 hover:bg-sky-800 text-white text-center uppercase rounded font-bold text-sm cursor-pointer transition-colors w-full p-2 mt-5 '
            value="Buscar colaborador"
          />

      </div>
    </form>
  )
}

export default FormularioColaborador