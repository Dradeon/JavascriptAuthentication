import axios from 'axios';
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { useEffect, useState } from 'react';

const SignInForm = () => {
    const [invalidUserPass,setInvalidUserPass] = useState(false);
    const [expiredToken, setExpiredToken] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem('auth-token') !== null){
              setExpiredToken(true);
            }
          }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = new FormData(event.target);
        const formData = Object.fromEntries(form.entries());
        const reqObject = {user: formData.Username, pass:formData.Password};

        axios.post('http://localhost:8080/login',reqObject)
        .then((response) => {
            console.log(response)
            setInvalidUserPass(false);
            // Put token in local storage
            localStorage.setItem('auth-token',response.data["auth-token"])

            router.push('/')
            
        })
        .catch((error) => {
            console.log(error);
            if(error.response.data == "Invalid Username/Password"){
                document.getElementById("Username").setCustomValidity("Username or Password is Wrong");
                document.getElementById("Password").setCustomValidity("Username or Password is Wrong");
            }
        })

    }

    return (
        <div>
            <Head>
                <title>Login</title>
                <meta name = "viewport" content = "intial-scale=1.0, width=device-width"></meta>
            </Head>
            <div className="signinform--container">
                <form onSubmit={handleSubmit} className="signinform" autoComplete='off'>
                    <h1 className = "signinpage--title">Welcome!</h1>
                    <h2 className = "signinpage--title2">Let's Sign You In</h2>
                    <label htmlFor='Username'>Username</label>
                    <input name = "Username" id = "Username" type = "text" className="signinform--username" />
                    <label htmlFor='Password'>Password</label>
                    <input name = "Password" id = "Password" type = "password" className="signinform--password" />
                    <button type = 'submit' className = 'signinform--submitbutton'><p>Submit</p></button>
                    <p className='signinform--signuplink'><small>Don't Have An Account? <a href = "SignUpForm" className=''>Sign Up</a></small></p>
                </form>
                {expiredToken ? <div className='Error-Token'>Token is Expired/Not Valid. Please Login</div> : <></>}
            </div>
            <footer className='footer'>
                <p><small>Copyright © Reza 2022</small></p>
            </footer>
        </div>
    )
}

export default SignInForm;