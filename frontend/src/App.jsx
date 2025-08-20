import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

function App() {

  return (
  <Router>
    <div className='min-h-screen bg-gray-50'>
      <Navbar/>
    <Routes>
      <Route path="/register" element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={<Profile/>} />
    </Routes>
    </div>
  </Router>
  )
}

export default App
