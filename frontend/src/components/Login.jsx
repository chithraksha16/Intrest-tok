import React, { useContext, useState } from 'react'
import { AppContext } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom'
import { showError, showSuccess } from '../utils/Toast'
const Login = () => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const {login}=useContext(AppContext);
    const naviagte=useNavigate();


    const handleLogin=async(e)=>{
      try{
      e.preventDefault();
      const result=await login(email,password);
      setEmail('')
      setPassword('')
      showSuccess(result.data.message)
      naviagte('/')
      }
      catch(error){
        console.error("Login failed",error)
        showError("Login failed")
      }
    }
  return (
    <>
    <div className='w-full h-screen flex justify-center items-center bg-black'>
      <form action="" onSubmit={handleLogin}>
        <div className='flex items-center flex-col w-[250px] h-72 justify-center md:w-sm  border-2 border-black outline-2 outline-white rounded-lg bg-white text-black p-10 rounded-ss-[50px] rounded-ee-[50px] '>
        <h1 className='text-xl font-extrabold font-mono pt-5'>Login</h1>
        <div className='flex flex-col pt-7'>

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
            <button type='submit' className='px-10 py-1.5 bg-black text-sm text-white rounded-md'>Login</button>
            </div>
        </div>
        </div>
        </form>
      </div>
    </>
  )
}

export default Login
