import React, { useContext, useState } from 'react'
import { AppContext } from '../contexts/AppContext'
import { showError, showSuccess } from '../utils/Toast'
import { useNavigate } from 'react-router-dom'
const Register = () => {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const {register}=useContext(AppContext);
  const navigate=useNavigate();


  const handleSubmit=async(e)=>{
      e.preventDefault();
      try{
      const result=await register(name,email,password);
      showSuccess(result.data.message)
      setName('')
      setEmail('')
      setPassword('')
      navigate('/login')

      }
      catch(error){
        console.error("Registration error",error.response?.data || error.message)
        showError("Registration error")
      }

  }

  return (
    <>
      <div className='w-full h-screen flex justify-center items-center bg-black'>
        <form onSubmit={handleSubmit} >
        <div className='flex items-center flex-col w-[250px] h-72 justify-center md:w-sm  border-2 border-black outline-2 outline-white rounded-lg bg-white text-black p-10 rounded-ss-[50px] rounded-ee-[50px]'>
          <h1 className='text-xl font-extrabold font-mono pt-5'>Register</h1>
          <div className='flex flex-col pt-7'>

            <div className='pb-4'>
              <input type="text"
                className='px-4 bg-gray-300 focus:border-b-2 focus:border-b-black focus:outline-none'
                name="name"
                placeholder='Name:'
                value={name}
                onChange={e=>setName(e.target.value)}
                id="" />
            </div>
            <div className='pb-4'>
              <input type="email"
                className='px-4 bg-gray-300  focus:border-b-2 focus:border-b-black focus:outline-none'
                name="email"
                placeholder='Email:'
                value={email}
                onChange={e=>setEmail(e.target.value)}
                id="" />
            </div>
            <div className='pb-6'>
              <input type="password"
                className='px-4 bg-gray-300  focus:border-b-2 focus:border-b-black focus:outline-none'
                name="password"
                placeholder='Password:'
                value={password}
                onChange={e=>setPassword(e.target.value)}
                id="" />
            </div>
            <div className='pb-4 pt-2 flex justify-center'>
              <button type='submit' className='px-10 py-1.5 bg-black text-sm text-white rounded-md'>Register</button>
            </div>
          </div>
        </div>
        </form>
      </div>
    </>
  )
}

export default Register
