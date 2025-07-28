import {useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/it-logo.png';
import { AppContext } from '../contexts/AppContext';
import UserMenu from './UserMenu';
const Header = () => {
  

  const {userName}=useContext(AppContext);

  return (
    <header className='w-full h-16 bg-black shadow-md outline-1 outline-white border-b-3 border-r-3 border-black'>
      <nav className='max-w-6xl mx-auto px-4 h-full flex items-center justify-between'>
        <div className=' text-sm sm:text-xl font-bold text-white flex gap-2 items-center'>
          <img className='w-7 h-6' src={logo} alt="logo" />
          <Link to='/'>
          Interest-tok
          </Link>
        </div>

        {/* Search / Post Questions */}
  

        {/* Login / Signup */}
        <div >
        {userName ? (
        <div className='text-white text-xs md:text-lg flex justify-center items-center gap-2'>
          <span className=''>{userName ||""}</span>
          <UserMenu/>
        </div>
        ) :(

      
        <div className=' flex gap-5 text-white'>
          <Link to='/login'>
          <button className=' sm:px-4 sm:py-1 sm:text-md px-2 py-0.5 text-xs border-1 border-slate-400 text-white hover:bg-white hover:text-black rounded-md shadow-xs shadow-white outline-none'>Login</button></Link>
          
          <Link to='/register'>
          <button className=' sm:px-4 sm:py-1 sm:text-md px-2 py-0.5 text-xs bg-white text-black hover:bg-black hover:text-white hover:border-1 border-slate-400 rounded-md shadow-xs shadow-white outline-none'>Signup</button></Link>
        </div>
        
)}
</div>
      </nav>
    </header>
  );
};

export default Header;
