import  { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { showError, showSuccess } from '../utils/Toast';

const MyQuestions = () => {
  const { getUserQuestion, deleteQuestion, deleteAnswer, deleteComment } = useContext(AppContext);
  const [userQuestions, setUserQuestions] = useState([]);
  const [openQuestions, setOpenQuestions] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        const questions = await getUserQuestion(userId);
        const questionList = questions?.data?.questions;
        setUserQuestions(Array.isArray(questionList) ? questionList : []);
      } catch (err) {
      throw err
      }
    };

    fetchQuestions();
  }, []);

  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion(id);
      setUserQuestions(prev => prev.filter(q => q._id !== id));
      showSuccess("Question deleted ");
    }
    else{
      showError("question not deleted")
    }
  };

  const handleDeleteAnswer = async (answerId, questionId) => {
    if (window.confirm("Delete this answer?")) {
      await deleteAnswer(answerId);
      setUserQuestions(prev =>
        prev.map(q => {
          if (q._id === questionId) {
            return {
              ...q,
              answers: q.answers.filter(a => a._id !== answerId)
            };
          }
          return q;
        })
      );
      showSuccess("Answer deleted");
    }
    else{
      showError("Answer not deleted")
    }
  };

  const handleDeleteComment = async (commentId, answerId, questionId) => {
    if (window.confirm("Delete this comment?")) {
      await deleteComment(commentId);
      setUserQuestions(prev =>
        prev.map(q => {
          if (q._id === questionId) {
            return {
              ...q,
              answers: q.answers.map(a => {
                if (a._id === answerId) {
                  return {
                    ...a,
                    comments: a.comments.filter(c => c._id !== commentId)
                  };
                }
                return a;
              })
            };
          }
          return q;
        })
      );
      showSuccess("Comment deleted")
    }
    else{
      showError("Comment not deleted");
    }
  };

  return (
    <>
    <div className='w-full bg-black  min-h-screen py-10'>
    <div className="max-w-2xl mx-auto p-5 ">
      <h2 className="text-2xl font-bold mb-5 text-white">My Questions</h2>

      {userQuestions.length === 0 ? (
        <p className="text-gray-400 text-center">You haven't asked any questions yet.</p>
      ) : (
        <ul className="space-y-6">
          {userQuestions.map((q) => (
            <li key={q._id} className="bg-gray-900 p-5 rounded-lg shadow text-white">
              <div className="flex flex-col justify-between  gap-2">
                <div>
                  <h3 className="text-xl font-semibold">{q.title}</h3>
                  <p className="text-sm text-gray-400">{q.description || 'No description.'}</p>
                  <div>{q.image && (
                    <img  src={q.image} height={150} width={200}/>
                  )}</div>
                </div>
                <div className="flex  gap-3 pt-3">
                  <Link to={`/updateQuestion/${q._id}`} className="text-yellow-400 hover:text-yellow-300">
                    <MdEdit size={20} />
                  </Link>
                  <button
                    onClick={() => handleDeleteQuestion(q._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>

              {/* Toggle Answers */}
              <button
                className="text-sm text-indigo-400 mt-3 hover:underline"
                onClick={() => toggleQuestion(q._id)}
              >
                {openQuestions[q._id] ? 'Hide Answers ▲' : `Show Answers (${q.answers.length || 0}) ▼`}
              </button>

              {/* Answers Section */}
              {openQuestions[q._id] && q.answers.length > 0 && (
                <div className="mt-4 pl-4 border-l-4 border-indigo-500">
                  <h4 className="text-indigo-400 font-semibold mb-2">Answers:</h4>
                  {q.answers.map((ans) => (
                    <div key={ans._id} className="mb-4">
                      <p className="text-gray-300 mb-1">{ans.content}</p>
                      <p className="text-xs text-gray-500 italic">
                        — {ans.answeredBy?.name || 'User'}, {new Date(ans.createdAt).toLocaleString()}
                      </p>

                      {/* Answer Actions */}
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <button
                          onClick={() => handleDeleteAnswer(ans._id, q._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete Answer
                        </button>
                      </div>

                      {/* Comments */}
                      {ans.comments && ans.comments.length > 0 && (
                        <div className="mt-2 ml-4 pl-3 border-l-2 border-gray-700">
                          <h5 className="text-sm font-semibold text-indigo-300 mb-1">Comments:</h5>
                          {ans.comments.map((c) => (
                            <div
                              key={c._id}
                              className="flex justify-between items-start text-sm text-gray-400 mb-1"
                            >
                              <span>
                                <strong>{c.commentedBy?.name || 'User'}:</strong> {c.content}
                              </span>
                              <button
                                onClick={() => handleDeleteComment(c._id, ans._id, q._id)}
                                className="text-red-400 hover:text-red-300 ml-2 text-xs"
                              >
                                🗑
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
    </>
  );
};

export default MyQuestions;
