import React from 'react'

const Button = ({button_name, onClick=null}) => {
  return (
    <>
    <button type='submit' onClick={onClick} className='p-2  bg-blue-500 rounded-2xl text-white hover:bg-blue-800'>
        {button_name}
    </button>
    </>
  )
}

export default Button
