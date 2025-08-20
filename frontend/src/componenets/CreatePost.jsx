import React from 'react';
import { useState } from 'react';
import Button from './Button';
import Label from './Label';
import Alert from './Alert';

const CreatePost = () => {

    const [postData, setPostData] = useState({
        "title": '',
        "text": ""
    })
    const [message, setMessage] = useState(null);
    const handleSubmit = e => {
        e.preventDefault()
        const token = localStorage.getItem("token")

        const res = fetch('http://127.0.0.1:5000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ title: postData.title, text: postData.text })
        })
            .then((res) => res.json())
            .then((data) => {
                setMessage({ type: 'success', text: data.message || "Post created succesfully" })
                setPostData({ "title": "", "text": "" })
            })
            .catch((err) => {
                console.log(err)
                setMessage({ type: 'error', text: 'Failed to create post.' });

            })
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setPostData((prev) => ({
            ...prev,
            [name] : value
        }))
    }


    return (
        <div className='flex flex-col justify-center items-center p-4 m-2 bg-white'>
            <div className='w-full md:max-w-md sm:max-w-sm'>
                <h2 className='text-xl font-bold text-gray-800 text-center'>
                    Create Post
                </h2>
                {message && (
                    <Alert type={message.type} text={message.text} onClose={() => setMessage(null)} duration={4000} />)} 
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <Label placeholder="Title" name="title" value={postData.title} handleChange={handleChange}/>
                    <Label placeholder="Content" name="text" value={postData.text} handleChange={handleChange}
                    style={'w-full px-4 py-10 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}/>
                    <Button button_name="Post"/>
                </form>
            </div>
        </div>
    )
}

export default CreatePost
