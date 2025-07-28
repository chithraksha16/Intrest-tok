import  { useContext, useState, useMemo } from 'react';
import { MdDelete } from "react-icons/md";
import { AppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { showError, showSuccess } from '../utils/Toast';
const Feed = () => {
  const { question,setQuestion,deleteQuestion,likeAndUnlikeQuestion } = useContext(AppContext);
  const {postAnswer,deleteAnswer,likeAndUnlikeAnswer}=useContext(AppContext);
  const {postComment,likeAndUnlikeComment,deleteComment}=useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [openComments, setOpenComments] = useState({});

  // Modal state
const [showAnswerModal, setShowAnswerModal] = useState(false);
const [currentQuestionId, setCurrentQuestionId] = useState(null);
const [answerContent, setAnswerContent] = useState('');
  //comment
const [showCommentModal, setShowCommentModal] = useState(false);
const [currentAnswerId, setCurrentAnswerId] = useState(null);
const [commentContent, setCommentContent] = useState('');


const filteredQuestions = useMemo(() => {
    if (!searchTerm) return question || [];
    return (question || []).filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
}, [searchTerm, question]);

const toggleAnswers = (questionId) => {
    setOpenAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleComments = (answerId) => {
    setOpenComments(prev => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };

  const handleSubmitAnswer =async (e) => {
    try{
        e.preventDefault()
    if (!answerContent.trim()) return;
    const result=await postAnswer(currentQuestionId,answerContent)
    showSuccess(result.data.message);

    const updateData=result.data.answer;

    setQuestion(prev=>prev.map((q)=>{
      if(q._id===currentQuestionId){
            return{
              ...q,
              answers:[...q.answers,updateData]
            }
      }
      return q
    }))

    // Reset
    setAnswerContent('');
    setShowAnswerModal(false);
    setCurrentQuestionId(null);
    
    }
    catch(error){
      showError("Answer not posted")
    }
  };


  const handleSubmitComment = async (e) => {
  e.preventDefault();
  try {
    if (!commentContent.trim()) return;
    const result = await postComment(currentAnswerId, commentContent);
    showSuccess(result.data.message)

    const updateData=result.data.comment;

    setQuestion(prev=>prev.map(q=>({
      ...q,
      answers:q.answers.map(ans=>{
        if(ans._id===currentAnswerId){
          return{
            ...ans,
            comments:[...ans.comments,updateData]
          }
        }
        return ans
      })
    })
  
    ))

    setCommentContent('');
    setShowCommentModal(false);
    setCurrentAnswerId(null);
    setQuestion
  } catch (error) {
    showError("Comment not posted")
  }
};

const handleDeleteAns=async(answerId)=>{
    try{
        const confirmDelete=window.confirm("Are sure want to delete this answer?");
        if(!confirmDelete) return;

        const result=await deleteAnswer(answerId);
        showSuccess(result.data.message);
        setQuestion(prev=>prev.map((q)=>({
            ...q,
            answers:q.answers.filter(ans=>ans._id !==answerId)
        }))
      )
    }
    catch (error) {
    showError(error.response.data.message || "Answer not deleted")
  }

}


const handleDeleteCom=async(commentId)=>{
    try{
        const confirmDelete=window.confirm("Are sure want to delete this?");
        if(!confirmDelete) return ;

        const result=await deleteComment(commentId);
        showSuccess(result.data.message)
        setQuestion(curr=>curr.map((q)=>({
            ...q,
            answers:q.answers.map((ans)=>({
              ...ans,
              comments:ans.comments.filter((com)=>{
                return com._id !== commentId
              })
            })
            )
        }))
      )
    }
    catch(error){
        showError(error.response.data.message ||"Comment not deleted")
    }
}
const handleDeleteques=async(questionId)=>{
  try{
    const confirmDelete=window.confirm("Are you sure want to delete this?")
    if(!confirmDelete) return;
    const result=await deleteQuestion(questionId)
    showSuccess(result.data.message);
    setQuestion(curr=>curr.filter(q=>q._id !== questionId))
  }
  catch(error){
    showError(error.response.data.message || "Question not deleted");
  }
}


const handlelikequestion = async (questionId) => {
  const userId = localStorage.getItem('userId');
  const targetQuestion = question.find(q => q._id === questionId);
  if (!targetQuestion) return;

  // ✅ Rely on backend to determine like/unlike
  const hasliked = Array.isArray(targetQuestion.likedBy)
    ? targetQuestion.likedBy.includes(userId)
    : false;

  const action = hasliked ? 'unlike' : 'like';

  try {
    const result = await likeAndUnlikeQuestion(questionId, action); // returns updated likedBy & likesCount
    const updated = result.data;

    // ✅ Update only after server response
    setQuestion(prev =>
      prev.map(q => q._id === questionId
        ? {
            ...q,
            likesCount: updated.likesCount,
            likedBy: updated.likedBy
          }
        : q
      )
    );
  } catch (error) {
    throw error
  }
};
const handleLikeAnswer = async (answerId) => {
  try {
    const target = question.find(q => 
      q.answers.find(ans => ans._id === answerId)
    );
    const answer = target?.answers.find(ans => ans._id === answerId);
    const userId = localStorage.getItem("userId");

    const hasLiked = answer.likedBy?.some(id => id.toString() === userId);
    const action = hasLiked ? 'unlike' : 'like';

    const result = await likeAndUnlikeAnswer(answerId, action);

    const updatedLikesCount = result.data.likesCount;

    setQuestion(prev =>
      prev.map(q => ({
        ...q,
        answers: q.answers.map(ans =>
          ans._id === answerId
            ? {
                ...ans,
                likesCount: updatedLikesCount,
                likedBy: action === 'like'
                  ? [...ans.likedBy, userId]
                  : ans.likedBy.filter(id => id !== userId),
              }
            : ans
        )
      }))
    );
  } catch (err) {
  throw err
  }
};

const handleLikeComment = async (commentId) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return;
  }

  // Find comment in current state
  let foundComment = null;
  question.forEach(q => {
    q.answers.forEach(ans => {
      ans.comments.forEach(c => {
        if (c._id === commentId) foundComment = c;
      });
    });
  });

  if (!foundComment) {
    return;
  }

  const likedBy = foundComment.likedBy || [];
  const hasLiked = likedBy.some(id => id.toString() === userId.toString());

  const action = hasLiked ? 'unlike' : 'like';

  try {
    const response = await likeAndUnlikeComment(commentId, action);
    const { likesCount, likedBy: updatedLikedBy } = response.data;

    // Defensive update - check ans.comments exists before mapping
    setQuestion(prev =>
      prev.map(q => ({
        ...q,
        answers: q.answers.map(ans => ({
          ...ans,
          comments: Array.isArray(ans.comments) ? ans.comments.map(c =>
            c._id === commentId ? { ...c, likesCount, likedBy: updatedLikedBy } : c
          ) : []
        }))
      }))
    );
  } catch (error) {
    throw error
  }
};


  return (
    <div className=" w-full p-4 max-w-4xl mx-2">
      {/* Search Bar */}
    <div className="mb-8">
  <div className="relative">
    <input
      type="search"
      placeholder="Search questions..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      className="w-full px-10 py-3 rounded-md bg-black border border-indigo-600 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition duration-200"
    />
    <svg
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  </div>
</div>


      {filteredQuestions && filteredQuestions.length > 0 ? (
        filteredQuestions.map((q, index) => (
          <div
            key={q._id || index}
            className="bg-black p-6  shadow-lg shadow-blue-500/10  border-1 border-slate-800 mb-10 text-white rounded-xl"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-gray-300 shadow animate-pulse transition-shadow" />
              <div>
                <h4 className="font-semibold text-sm">{q.askedBy?.name || 'Anonymous'}</h4>
                <p className="text-[10px] text-gray-500">{new Date(q.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Question Title */}
            <h3 className="sm:text-lg text-sm font-extrabold mb-3">{q.title}</h3>

            
              {q.image &&(
                <img  src={q.image} height={150} width={200}/>
              )
              }

            {/* Description */}
            <p className="sm:text-base text-xs text-gray-300 mb-2 leading-relaxed">
              {q.description || 'No description provided.'}
            </p>
            

            {/* Likes and Actions */}
            <div className="flex gap-3 sm:gap-8 items-center my-4 text-[10px] sm:text-sm text-gray-400 ">
              <button onClick={()=>handlelikequestion(q._id)} className="flex items-center gap-1 sm:gap-2 hover:text-white">
                <span className="sm:text-lg text-sm">👍</span> <span>{q.likesCount || 0}</span>
              </button>
              <button
                className="hover:text-white font-medium"
                onClick={() => {
                  setCurrentQuestionId(q._id);
                  setShowAnswerModal(true);
                }}
              >
                💬 Answer
              </button>
              <div className='flex items-center'>
                <Link to={`/updateQuestion/${q._id}`}><button>Edit</button></Link>
              </div>
              <div className='md:text-lg text-md  flex items-center'>
              <button onClick={()=>handleDeleteques(q._id)}><MdDelete /></button>
              </div>
              
              {q.answers && q.answers.length > 0 && (
                <div className='md:ml-auto'>
                <button
                  onClick={() => toggleAnswers(q._id)}
                  className="text-indigo-400 hover:text-indigo-600 font-semibold  text-[10px] sm:text-sm transition"
                >
                  {openAnswers[q._id] ? 'Hide Answers' : `Show Answers (${q.answers.length})`}
                </button>
                </div>
              )}
            </div>

            {/* Answers Section - Collapsible */}
            {openAnswers[q._id] && q.answers && q.answers.length > 0 && (
              <div className="bg-gray-900 p-5 rounded-lg shadow-inner border border-gray-800 mt-6">
                <h4 className="text-base font-semibold mb-4 text-white border-b border-gray-800 pb-2">
                  Answers:
                </h4>
                {q.answers.map((ans) => (
                  <div
                    key={ans._id}
                    className="mb-6 pl-5 border-l-4 border-indigo-500"
                  >
                    <p className="mb-2 text-gray-100 text-base leading-relaxed">{ans.content}</p>
                    <p className="text-xs text-gray-400 italic mb-3">
                      — {ans.answeredBy?.name || 'User'}, {new Date(ans.createdAt).toLocaleString()}
                    </p>

                    <div className="flex gap-6 items-center mb-4 text-gray-400 text-sm">
                      <button onClick={()=>handleLikeAnswer(ans._id)} className="flex items-center gap-1 hover:text-white transition font-semibold">
                        <span className="text-lg">👍</span> {ans.likesCount || 0}
                      </button>

                    <div className='text-lg flex items-center'>
                                <button onClick={()=>handleDeleteAns(ans._id)}><MdDelete /></button>
                            </div>

                      <div><button  onClick={() => {
                                    setCurrentAnswerId(ans._id);
                                    setShowCommentModal(true);
                                    }}
                            className="hover:text-white transition font-semibold">
                            💬 Comment
                            </button></div>
                            

                      {/* Comment toggle button */}
                      {ans.comments && ans.comments.length > 0 && (
                        <button
                          onClick={() => toggleComments(ans._id)}
                          className="hover:text-white transition font-semibold"
                        >
                          {openComments[ans._id] ? 'Hide Comments' : `Show Comments (${ans.comments.length})`}
                        </button>
                      )}
                    </div>

                    {/* Comments Section */}
                    {openComments[ans._id] && ans.comments && ans.comments.length > 0 && (
                      <div className="mt-3 pl-5 border-l-2 border-gray-700">
                        <h5 className="text-xs font-semibold text-indigo-400 mb-3">
                          Comments:
                        </h5>
                        {ans.comments.map((c, index) => (
                          <div
                            key={c._id || index}
                            className="mb-3 flex justify-between items-start gap-4"
                          >
                            <div className="text-xs text-gray-300">
                              <span className="font-semibold">{c.commentedBy?.name || 'User'}:</span>{' '}
                              {c.content}
                            </div>
                            <button onClick={()=>handleLikeComment(c._id)}  className="flex items-center gap-1 hover:text-white transition text-xs text-gray-400 font-semibold">
                              <span className="text-base">👍</span> {c.likesCount || 0}
                            </button>
                            <div>
                                <button onClick={()=>handleDeleteCom(c._id)}><MdDelete /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-white text-center">No questions found.</p>
      )}

      {/* Answer Modal */}
      {showAnswerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg text-white relative">
            <button
              onClick={() => {
                setShowAnswerModal(false);
                setAnswerContent('');
              }}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">Write Your Answer</h2>

            <textarea
              rows="5"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your answer here..."
            ></textarea>

            <button
              onClick={handleSubmitAnswer}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold"
            >
            Submit Answer
            </button>
          </div>
        </div>
      )}

      {showCommentModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg text-white relative">
      <button
        onClick={() => {
          setShowCommentModal(false);
          setCommentContent('');
        }}
        className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
      >
        ×
      </button>

      <h2 className="text-lg font-semibold mb-4">Write a Comment</h2>

      <textarea
        rows="4"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        className="w-full p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type your comment here..."
      ></textarea>

      <button
        onClick={handleSubmitComment}
        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold"
      >
        Submit Comment
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Feed;
