import React from 'react'

const Label = ({label, name, value, handleChange, placeholder, type="text", style='w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}) => {
  return (
   <>
   <label className='block text-gray-800 mb-1'>{label}</label>
          <input type={type}
          name={name}
          value = {value}
          onChange={handleChange}
          className={style}
          placeholder={placeholder}/>
   </>
  )
}

export default Label