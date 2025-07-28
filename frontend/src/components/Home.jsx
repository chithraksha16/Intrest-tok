import { useState,useEffect } from 'react'
import Feed from './Feed'
import { Link } from 'react-router-dom';
import { IoIosAddCircle } from "react-icons/io";
const Home = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timeout = setTimeout(() => setLoaded(true), 100); // small delay for effect
    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      <div className='w-full h-auto bg-black'>
        <section className="w-full bg-black pt-15 pb-5 px-6 sm:px-12 text-center">
      <div
        className={`max-w-3xl mx-auto transition-opacity duration-1000 ease-out ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transform`}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Got a question, idea, or something on your mind?
        </h1>
        <p className="text-base sm:text-lg text-gray-300 mb-8">
          Start a discussion, share your thoughts, or just ask—nothing is too big or too small. <br />
          Say it your way — ask what you want, share what you feel, take it wherever you like.
        </p>
    <div className='flex justify-center mt-3'>     
  <Link to="/postquestion">
    <button
      type="submit"
      className="flex items-center gap-2 px-5 py-1 bg-black text-white rounded hover:bg-white hover:text-black transition-colors border border-white hover:border-white"
    >
      <IoIosAddCircle className="text-lg" />
      <span>Post</span>
    </button>
  </Link>
  </div>

      </div>
    </section>
        <div className='flex justify-center items-center'>
          {loaded &&
            <Feed/>
          }
        </div>
      </div>
    </>
  )
}

export default Home
