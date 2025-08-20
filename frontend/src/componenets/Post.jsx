import React from 'react'

const Post = ({post}) => {
  return (
    <div className='min-h-screen max-w-md mt-2 border-gray-50 rounded-2xl shadow-2xl bg-white'>
      <div className='felx flex-col justify-between items-center'>
        <h2 className='text-xl text-bold text-black'>{post.title}</h2>
        <p className='text-xs text-gray-900'>{post.content}</p>
        <div className='felx justify-between text-sm text-gray-500'>
          <span>By: {post.author.name}</span>
          <span>{post.created_at}</span>
        </div>
      </div>
      
    </div>
  )
}

export default Post
