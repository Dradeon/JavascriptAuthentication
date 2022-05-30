import axios from 'axios';
import {useRouter} from 'next/router'
import SignInForm from './SignInForm'


import Profile from './Profile';





export default function Home({users}) {
  const router = useRouter();



  if(typeof window !== "undefined"){
    if(window.localStorage.getItem('auth-token') !== null){
      return <Profile posts = {users}></Profile>
    }
  }
  

  return (
    <div>
        <SignInForm/>
    </div>
  )
}


