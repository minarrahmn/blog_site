import React from 'react';
import { useState } from 'react';
import Label from '../componenets/Label';
import Button from '../componenets/Button';
import Alert from '../componenets/Alert';

const Register = () => {

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [formData, setFormData] = useState({
    'name': '',
    'gender': 'Male',
    'email': '',
    'username': '',
    'password': ''
  })

  const [message, setMessage] = useState(null)

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword)

    setFormData((prevFormData) => ({
      ...prevFormData,
      'password': newPassword
    }))
  }
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }
  const isMatch = password && confirmPassword && password === confirmPassword;



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: data.success || "Registered Successfully" })
        setFormData({ 'name': '', 'gender': 'Male', 'email': '', 'username': '', 'password': '' })
        setPassword("")
        setConfirmPassword("")
      }
      else {
        setMessage({ type: 'error', text: data.error || "Something went wrong" })
      }

    }
    catch (error) {
      setMessage({ type: 'error', text: 'server error' })
    }


  }




  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
      <div className='w-full md:max-w-md sm:max-w-sm bg-white p-8 rounded-2xl shadow-lg'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Create Account
        </h2>
        {message && (
          <Alert type={message.type}
          text= {message.text}
          onClose={()=> setMessage(null)}
          duration={4000}/>
        )}
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Label label="Name" name='name' value={formData.name} handleChange={handleChange} />
          <Label label="Email" name='email' value={formData.email} handleChange={handleChange} />
          <Label label="Username" name='username' value={formData.username} handleChange={handleChange} />
          <Label label="Password" type='password' name='password' value={formData.password} handleChange={handlePasswordChange} />
          <div>
            <label className="block text-gray-700 mb=1">Confirm Password</label>
            <input type="password" 
            className={`w-full px-4 py-2 border ${confirmPassword && !isMatch ? 'border-red-500':'border-gray-400'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600`} 
            name= "confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}/>
          </div>
          {confirmPassword && !isMatch && (
            <p  className="text-red-500 text-sm mt-1">Password do not match</p>
          )}
          <select 
          name='gender'
          value={formData.gender}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <Button button_name="Register" />
        </form>
      </div>

    </div>
  )
}

export default Register
