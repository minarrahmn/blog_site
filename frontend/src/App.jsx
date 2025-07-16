import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componenets/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

function App() {

  return (
  <Router>
    <div className='min-h-screen bg-gray-50'>
      <Navbar/>
    <Routes>
      <Route path="/register" element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </div>
  </Router>
  )
}

export default App
