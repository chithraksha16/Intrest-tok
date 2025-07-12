import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-6 border-t border-gray-700 ">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        {/* Left Side - Brand Name */}
        <div className="mb-4 md:mb-0 text-white font-semibold text-lg">
          Interest-tok
        </div>

        {/* Center - Navigation Links */}
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/my-question" className="hover:text-white transition">My Questions</Link>
          <Link to="/postquestion" className="hover:text-white transition">Post Question</Link>
        </div>

        {/* Right Side - Copyright */}
        <div className="mt-4 md:mt-0 text-xs text-gray-500">
          © {new Date().getFullYear()} Interest-tok. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
