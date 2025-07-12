import React, { useState } from 'react'
import { BsChevronBarDown } from "react-icons/bs";
import { useNavigate,Link } from 'react-router-dom';
import { showSuccess } from '../utils/Toast';
const UserMenu = () => {
    const [isOpen,setIsOpen]=useState(false)
    const navigate=useNavigate();

    const toggleMenu=()=>{
        setIsOpen(prev=> !prev)
    }

    const logout=()=>{
        const confirmlogout=window.confirm("Are sure want to Logout?");
        if(!confirmlogout) return ;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        showSuccess("User logouted")
        setInterval(()=>{
        window.location.reload();
        navigate('/login');
        },1500)
        
    }
  return (
    <>
      <div className="relative text-white text-xs md:text-lg  ">
      <button onClick={toggleMenu} className="font-medium flex justify-center items-center mt-1 ">
        <BsChevronBarDown />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 md:w-48 w-32 bg-white text-black rounded shadow-md z-50">
          <ul className="flex flex-col text-xs md:text-sm">
            <Link to="/postquestion" onClick={()=>setIsOpen( false)} className="px-4 py-2 hover:bg-gray-100">Post Question</Link>
            <Link to="/my-question" onClick={()=>setIsOpen( false)}  className="px-4 py-2 hover:bg-gray-100">My Questions</Link>
            <button
              onClick={logout}
              className="text-left px-4 py-2 hover:bg-gray-100 w-full"
            >
              Logout
            </button>
          </ul>
        </div>
      )}
    </div>
    </>
  )
}

export default UserMenu
