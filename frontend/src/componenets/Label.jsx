import React from 'react'

const Label = ({label, name, value, handleChange, type="text"}) => {
  return (
   <>
   <label className='block text-gray-800 mb-1'>{label}</label>
          <input type={type}
          name={name}
          value = {value}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'/>
   </>
  )
}

export default Label