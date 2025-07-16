import React from 'react';
import { useState } from 'react';
import Label from '../componenets/Label';
import Button from '../componenets/Button';
import Alert from '../componenets/Alert';

const Login = () => {
  const [formData, setFormData] = useState({
    'email': "",
    'password':''
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const {name, value} = e.target 
    setFormData((prev) => ({
      ...prev, 
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      const res = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST', 
        headers: {
          'Content-Type':'application/json'
        }, 
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({type:'success', text: data.success || "Login Successful" })
        setFormData({'email': '', 'password': ''})
      }
      else {
        setMessage({type:'error', text: data.error || "Wrong credentials"})
      }
    }
    catch(error){
      setMessage({type:'error', text: data.error || "Server error"})
    }
  }


  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-white'>
        <div className='w-full md:max-w-md sm:max-w-sm bg-white rounded-2xl p-8 shadow-lg'>
            <h2 className='text-2xl font-bold text-gray-800 text-center' >
                Login
            </h2>
             {
              message && (
                <Alert 
                type={message.type}
                text={message.text}
                onClose={()=> setMessage(null)}
                duration={4000} />
              )
             }
            <form className='space-y-6'onSubmit={handleSubmit}>
                <Label label="Email" type='email' name='email' value={formData.email} handleChange={handleChange}/>
                <Label label="Password" type='password' name='password' value={formData.password} handleChange={handleChange}/>
                <Button button_name='Login'/>
            </form>

        </div>
      
    </div>
  )
}

export default Login
