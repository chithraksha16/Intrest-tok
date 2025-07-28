import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-5 border-t border-gray-700 min-h-[80px]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm space-y-4 sm:space-y-0">
        
        
        <div className="text-white font-semibold text-lg min-w-[120px] text-center sm:text-left">
          Interest-tok
        </div>

        
        <div className="flex flex-wrap justify-center gap-4 min-w-[200px]">
          <Link to="/" className="hover:text-white transition duration-300">Home</Link>
          <Link to="/my-question" className="hover:text-white transition duration-300">My Questions</Link>
          <Link to="/postquestion" className="hover:text-white transition duration-300">Post Question</Link>
        </div>

        
        <div className="text-xs text-gray-500 min-w-[150px] text-center sm:text-right">
          © {new Date().getFullYear()} Interest-tok. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
