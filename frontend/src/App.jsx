import './App.css'
import {Route,Routes} from 'react-router-dom'
import Layout from './components/Layout'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import PostQuestion from './components/PostQuestion'
import UpdateQuestion from './components/UpdateQuestion'
import MyQuestions from './components/MyQuestions'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
 
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/postquestion' element={ 
            <ProtectedRoute>
            <PostQuestion/>
            </ProtectedRoute>} />
        <Route path='/updateQuestion/:questionId'  element={ 
            <ProtectedRoute>
            <UpdateQuestion/>
            </ProtectedRoute>} />
        <Route path='/my-question' element={
            <ProtectedRoute>
            <MyQuestions/>
            </ProtectedRoute>}  />
        </Route>
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App
