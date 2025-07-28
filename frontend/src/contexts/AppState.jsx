import { AppContext } from "./AppContext";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
const AppState = (props) => {

  const [token,setToken]=useState('')
  const [question,setQuestion]=useState([]);
  const [userName,setUserName]=useState(()=>localStorage.getItem('username') || null)
  const location=useLocation();
  const baseUrl="http://localhost:8080/api"
  

 const likeAndUnlikeComment=async(commentId,action)=>{
  const token=localStorage.getItem('token');
  try{
        const response= await axios.patch(`${baseUrl}/comment/${commentId}/like`,{
          action
        },
        {
          headers:{
          Authorization:`Bearer ${token}`
        },
      withCredentials:true
    })
      return response
      }
      catch(error){
    throw error
  }

 }
  const likeAndUnlikeAnswer=async(answerId,action)=>{
    const token=localStorage.getItem('token');
  try{
        const response= await axios.patch(`${baseUrl}/answer/${answerId}/like`,{
          action
        },
        {
          headers:{
          Authorization:`Bearer ${token}`
        },
      withCredentials:true
    })
      return response
      }
      catch(error){
    throw error
  }
}

  
const likeAndUnlikeQuestion=async(questionId,action)=>{
      const token=localStorage.getItem('token');
    try{
        const response= await axios.patch(`${baseUrl}/questions/${questionId}/like`,{
          action
        },
        {
          headers:{
          Authorization:`Bearer ${token}`
        },
      withCredentials:true
    })
      return response
      }
      catch(error){
    throw error
  }
}


const deleteAnswer=async(answerId)=>{
  const token=localStorage.getItem('token');
  try{
    const response=await axios.delete(`${baseUrl}/deleteAnswer/${answerId}`,
      {headers:{
            Authorization:`Bearer ${token}` 
      },
      withCredentials:true
    });
    return response
  }
  catch(error){
    throw error
  }

}

const deleteComment=async(commentId)=>{
    const token=localStorage.getItem('token');
    try{
      const response=await axios.delete(`${baseUrl}/comment/${commentId}/delete`,{
        headers:{
          Authorization:`Bearer ${token}`
        },
        withCredentials:true
      })
      return response
    }
    catch(error){
    throw error
  }
}

  const postComment=async(answerId,content)=>{
    const token=localStorage.getItem('token')
        try{
        const response=await axios.post(`${baseUrl}/comment/${answerId}`,{
          answerId,content
        },{
          headers:{
            Authorization:`Bearer ${token}`
          },
          withCredentials:true
        })
        return response
        }
        catch(error){
    throw error
  }
  }

const postAnswer=async(questionId,content)=>{
  const token=localStorage.getItem('token');
  try{
    const response=await axios.post(`${baseUrl}/questions/${questionId}/answers`,{questionId,
      content
    },{
      headers:{
        Authorization:`Bearer ${token}`
      },
      withCredentials:true
    })
    return response
  }
  catch(error){
    throw error
  }
}

const deleteQuestion=async(questionId)=>{
const token=localStorage.getItem('token');
try{
  const response= await axios.delete(`${baseUrl}/deleteQuestion/${questionId}`,{
    headers:{
      Authorization:`Bearer ${token}`
    },
    withCredentials:true
  })
  return response
}
catch(error){
    throw error
  }

}

const updateQuestion=async(questionId,updatedData)=>{
const token=localStorage.getItem('token');
try{
  const response=await axios.put(`${baseUrl}/updateQuestion/${questionId}`,
    updatedData
  ,
  {
    headers:{
      Authorization:`Bearer ${token}`
  },
  withCredentials:true
})
return response
}
catch(error){
    throw error
  }
}

const getSingleQuestion=async(questionId)=>{
    try{
      const response=await axios.get(`${baseUrl}/questionById/${questionId}`,{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      })
      return response
    }
    catch(error){
    throw error
  }
}


const postQuestion=async(title,description,image)=>{
  const token=localStorage.getItem('token')
    try{
      const response=await axios.post(`${baseUrl}/postquestion`,{
        title,description,image
      },{
        headers:{
          Authorization:`Bearer ${token}`
        },
        withCredentials:true
      })
      return response
    }
    catch(error){
      throw error
    }
}

const getUserQuestion=async(userId)=>{
    try{
      const response=await axios.get(`${baseUrl}/questions/${userId}`,{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      }) 
      return response
    }
    catch(error){
      throw error
    }
}



  useEffect(()=>{
    const fetchQuestion=async()=>{
    const response=await axios.get(`${baseUrl}/allquestion`,{
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials:true
    })
    setQuestion(response.data.questions)
    }
    fetchQuestion();
  },[location.pathname])

const register=async(name,email,password)=>{
  try{

  
      const response= await axios.post(`${baseUrl}/register`,{
      name,email,password
      },
      {
        headers:{
        "Content-Type":"application/json"
      },
      withCredentials:true
    })
  
      return response;
  }
  catch(error){
    throw error
  }

}
const login=async(email,password)=>{
  try{
    const response=await axios.post(`${baseUrl}/login`,{
      email,password
    },{
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials:true
    })
    const recievedToken=response.data.token;
    setToken(recievedToken);
    localStorage.setItem('token',recievedToken);
    localStorage.setItem('userId',response.data.user.id)
    localStorage.setItem('username',response.data.user.name)
    setUserName(response.data.user.name)
    return response
  }
    catch(error){
      throw error
    }
}
  return (
    <>
    <AppContext.Provider
      value={{register,userName,
      login,question,setQuestion,
      postQuestion,postAnswer,
      postComment,deleteAnswer,
      deleteComment,getSingleQuestion,
      updateQuestion,deleteQuestion,
      getUserQuestion,likeAndUnlikeQuestion,
      likeAndUnlikeAnswer,likeAndUnlikeComment}}>

        {props.children}
    </AppContext.Provider>
    </>
  )
}

export default AppState
