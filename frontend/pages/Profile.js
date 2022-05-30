import axios from 'axios';
import Head from 'next/head'
import {useRouter} from 'next/router';
import { Profiler, useEffect, useState } from 'react';



const Profile = () => {
  const Router = useRouter();
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
      console.log(res);
      const info = res.data.blogPosts;
      setPosts(info);
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
    localStorage.removeItem('auth-token')
    Router.push('/')
  }

  if(isLoading){
    return <div>Is Loading</div>
  }
  if(!posts){
    return <div>No Data</div>
  }

  return <div>
      <Head>
        <title>Profile</title>
        <meta name = "viewport" content = "intial-scale=1.0, width=device-width"></meta>
      </Head>
      <h1 className = "welcomePrompt">Hello User!</h1>
      <h3>Your Timeline</h3>
      <div className="Timeline">
          {posts.map((post)=>{
            return <div key = {post.id}>
              <h1>{post.title}</h1>
            </div>
          })}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>;
};






export default Profile;

