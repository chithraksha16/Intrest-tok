import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { showError, showSuccess } from '../utils/Toast';

const UpdateQuestion = () => {
  const { questionId } = useParams();
  const { getSingleQuestion, updateQuestion } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
    try {
        const res = await getSingleQuestion(questionId);
        const q = res.data.question;
        setTitle(q.title || '');
        setDescription(q.description || '');
        setImage(q.image || '');
    } catch (err) {
        console.error('Failed to load question:', err);
    }
    };

    fetchQuestion();
  }, [questionId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
      const updatedData={
        title,description,image
    }
    try {
      const result=await updateQuestion(questionId, updatedData);
      setTitle('');
      setDescription('');
      setImage('');
      navigate('/');
      showSuccess(result.data.message)
    } catch (error) {
      console.error('Failed to update question:', error);
      showError("Question not updated");
    }
  };

  return (
    <div className='w-full h-screen bg-black text-white flex justify-center items-center'>
      <div className='w-[310px] md:w-xl h-82 bg-white text-black border-2 border-black outline-2 outline-white p-8 rounded-lg'>
        <form onSubmit={handleUpdate}>
          <h1 className='text-center text-xl font-extrabold font-mono pb-2'>Update Question</h1>
          <div className='flex flex-col justify-center items-center font-medium'>
            <div className='flex flex-col gap-1 pb-2'>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                className='focus:border-b-2 focus:border-b-black focus:outline-none w-[280px] bg-gray-300'
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
              />
            </div>
            <div className='flex flex-col gap-1 pb-2'>
  <label htmlFor="description">Description:</label>
  <textarea
    className='focus:border-b-2 focus:border-b-black focus:outline-none w-[280px] bg-gray-300 text-sm p-2 h-14 resize-none'
    name="description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    id="description"
  />
</div>

            <div className='flex flex-col gap-1 pb-2'>
              <label htmlFor="image">ImageUrl:</label>
              <input
                type="text"
                className='focus:border-b-2 focus:border-b-black focus:outline-none w-[280px] bg-gray-300'
                name="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                id="image"
              />
            </div>
            <div className='flex p-2'>
              <button
                className='px-12 md:px-20 py-1 text-sm bg-slate-800 text-white rounded-sm hover:bg-slate-900'
                type='submit'
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
