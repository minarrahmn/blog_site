import React from 'react'

const Button = ({button_name}) => {
  return (
    <>
    <button type='submit' className='p-2  bg-blue-500 rounded-2xl text-white hover:bg-blue-800'>
        {button_name}
    </button>
    </>
  )
}

export default Button
