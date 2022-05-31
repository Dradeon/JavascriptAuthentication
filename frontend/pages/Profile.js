import axios from 'axios';
import Head from 'next/head'
import {useRouter} from 'next/router';
import { Profiler, useEffect, useState } from 'react';



const Profile = () => {
  const Router = useRouter();
  const [user,setUser] = useState(null);
  const [posts,setPosts] = useState(null);
  const [isLoading,setLoading] = useState(false);

  useEffect(()=> {
    setLoading(true);
    axios.get("http://localhost:8080/posts",{
      headers:{
        'access': window.localStorage.getItem("auth-token")
      }
    })
    .then((res)=>{
      const info = res.data;
      setPosts(info);
      setUser(res.headers['username']);
      console.log(user);
      setLoading(false);
    }).catch((error) => {
      console.log(error)
      if (error.response.data = "Login Needed"){
        Router.push('/SignInForm')
      }
    })
    
  },[])

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('auth-token');
    Router.push('/');
  }

  if(isLoading){
    return <div>Is Loading</div>
  }
  if(!posts){
    return <div>No Posts currently in the Database</div>
  }

  return <div>
      <Head>
        <title>Your Blog List</title>
        <meta name = "viewport" content = "intial-scale=1.0, width=device-width"></meta>
      </Head>
      <h1 className = "welcomePrompt">Hello {user}!</h1>
      <h3 className='Title-NewBlogs'>New Blogs:</h3>
      <div className="Timeline">
          {posts.map((post)=>{
            return <div key = {post.id} className = "Card-Article">
              <h1>{post.Title}</h1>
              <h2>{new Date(post.DateCreated).toLocaleDateString()}</h2>
              <p>{post.Content}</p>
            </div>
          })}
      </div>
      <button className='Button-Logout' onClick={handleLogout}><p>Logout</p></button>
      <footer className='Footer-Blog'>
        <p>By Bakhtiar Reza </p>
        <a href = "https://github.com/Dradeon/JavascriptAuthentication" target="_blank">View Source Code</a>
      </footer>
    </div>;
};






export default Profile;

