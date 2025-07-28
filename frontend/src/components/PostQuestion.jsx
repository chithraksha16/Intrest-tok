import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom'
import { showError, showSuccess } from '../utils/Toast'
const PostQuestion = () => {
    const [title,setTitle]=useState('')
    const [description,setDescription]=useState('')
    const [image,setImage]=useState('')
    const {postQuestion}=useContext(AppContext)
    const navigate=useNavigate();

const handlePost=async(e)=>{
    e.preventDefault();
    try{
        const result=await postQuestion(title,description,image);
        showSuccess(result.data.message);
        setTitle('')
        setDescription('')
        setImage('')
        navigate('/')
    }
    
    catch(error){
        showError(error.response?.data.message || "Question not posted");
    }

}


return (
    <>
    <div className='w-full h-screen bg-black text-white flex justify-center items-center'>
        <div className=' w-[310px] md:w-xl h-82 bg-white text-black border-2 border-black outline-2 outline-white p-8 rounded-lg'>
        <form action="" onSubmit={handlePost}>
            <h1 className='text-center text-xl font-extrabold font-mono pb-3'>Post Question</h1>
            <div className='flex flex-col justify-center items-center font-medium'>
                <div className='flex flex-col gap-1 pb-2'>
                    <label htmlFor="title">Title:</label>
                    <input type="text"
                    className='focus:border-b-2 focus:border-b-black focus:outline-none md:w-sm w-[220px] bg-gray-300 '
                    name="title"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    id="title" />
                </div>
                <div className='flex flex-col gap-1 pb-2'>
    <label htmlFor="description">Description:</label>
    <textarea
        className='focus:border-b-2 focus:border-b-black focus:outline-none md:w-sm w-[220px] bg-gray-300 text-sm p-2 resize-none h-14'
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        id="description"
    />
</div>
                <div className='flex flex-col gap-1 pb-2'>
                    <label htmlFor="image">ImageUrl:</label>
                    <input type="text"
                    className='focus:border-b-2 focus:border-b-black focus:outline-none md:w-sm w-[220px] bg-gray-300 '
                    name="image"
                    value={image}
                    onChange={(e)=>setImage(e.target.value)}
                    id="image" />
                </div>
                <div className='flex p-2'>
                    <button className=' px-12 md:px-20 py-1 text-sm bg-slate-800 text-white rounded-sm hover:bg-slate-900' type='submit'>Post</button>
                </div>
            </div>
        </form>        
        </div>
    </div>
    </>
)
}

export default PostQuestion
