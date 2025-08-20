  import React from 'react';
  import { useState } from 'react';
  import Button from './Button';
  import { Link, useNavigate } from 'react-router-dom';

  const Navbar = () => {
        const [isOpen, setIsOpen] = useState(false);
        const navigate = useNavigate()
        const handleLogout = () => {
          localStorage.removeItem("token");
          navigate("/login")
        }

        const isLoggedin = !!localStorage.getItem("token");

    return (
      <nav className='bg-white shadow-md'>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">
            My Blog Site
          </div>
          <div className="md:hidden">
            <button onClick={()=> setIsOpen(!isOpen)} className='text-gray-700 focus:outline-none'>
              ☰
            </button>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <Link className='text-gray-700 hover:text-blue-600 hover:scale-90'>Home</Link>
            <Link className='text-gray-700 hover:text-blue-600 hover:scale-90'>Posts</Link>
            <Link className='text-gray-700 hover:text-blue-600 hover:scale-90  '>About</Link>
            {isLoggedin? (<>
              <Link className='text-gray-700 hover:text-blue-600 hover:scale-90' to='/profile'>Profile</Link>
              <Button button_name={"Logout"} onClick={handleLogout}/>
              </>):(
              <Button button_name={"Login"} onClick={navigate("/login")}/>
            )
            }
          </div>
        </div>
          {isOpen && (<div className='md:hidden px-4 pb-4 flex flex-col space-y-2 '>
            <Link className='text-gray-700 hover:text-blue-600'>Home</Link>
            <Link className='text-gray-700 hover:text-blue-600'>Posts</Link>
           
            <Link className='text-gray-700 hover:text-blue-600'>About</Link>
             {isLoggedin? ( <>
               <Link className='text-gray-700 hover:text-blue-600'>Profile</Link>
               <Button button_name={"Logout"} onClick={handleLogout}/>
              </>):(
              <Button button_name={"Login"} onClick={navigate("/login")}/>
            )
            }
            </div>)}
        

      </nav>
    )
  }
  
  export default Navbar
