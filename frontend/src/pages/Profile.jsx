import React from 'react';
import axios from 'axios';
import { useEffect,useState } from 'react';
import Button from '../componenets/Button';
import CreatePost from '../componenets/CreatePost';
import { useNavigate, useParams } from 'react-router-dom';
import Post from '../componenets/Post';


const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(null);


    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login")
    }

    useEffect( () => {
        const token = localStorage.getItem("token");

        axios.get('http://127.0.0.1:5000/api/profile',{
            headers:{
                Authorization: `Bearer ${token}`,
            },
        })
        .then( res=> {
            setUser(res.data)
            return axios.get(`http://127.0.0.1:5000/api/user/${res.data.id}/posts`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        })
        .then(res => {
            console.log(res.data)
            setPosts(res.data.posts);
            setLoading(false);
        })

        .catch(err => {
            console.error("Unauthorized or server error", err);
            setLoading(true);
        })
    }, []);
    if(!user) return 
         <div className='flex justify-center items-center text-5xl text-center text-black'>Loading profile</div>

  return (
    <>
    <div className='max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg'>
        <h2 className="text-xl font-bold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
        <CreatePost/>
    </div>
    <div className='max-w-3xl mx-auto mt-10 px-4'>
        <h1 className='text-2xl text-bold mb-6 font-bold text-center'>
            User Posts
        </h1>
        {loading? (
            <p className='text-center'>Loading</p>
        ):(
            posts.length > 0?(
                posts.map(post => <Post key={post.key} post={post}/>) 
            ): (
                <p className='text-center text-shadow-gray-700'>No posts found for this user</p>
            )
        )}

    </div>
    </>
      )
}

export default Profile
