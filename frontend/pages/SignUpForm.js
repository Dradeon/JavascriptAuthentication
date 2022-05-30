import Head from 'next/head'
import axios from 'axios'
import { useRouter } from 'next/router';
import { useState } from 'react';



const SignUpForm = () => {
    const router = useRouter();
    const [userMatch, setUserMatch] = useState(false);
    const [passwordMatch,SetPasswordMatch] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        const formData = Object.fromEntries(form.entries());

        if(formData.Password !== formData.PasswordConf){
            SetPasswordMatch(false);
        }
        else{
            SetPasswordMatch(true);
            console.log({formData})
            const reqObject = {user:formData.Username,pass:formData.Password};

            axios.post('http://localhost:8080/signup', reqObject)
            .then(function (response){
                console.log(response);
                router.push('/');
            })
            .catch(function(error){
                console.log(error);
                if(error.response.data == "Username Taken"){
                    document.getElementById("user").focus();
                    document.getElementById("user").setCustomValidity("Username Already Taken")
                }
            });
        }    
        
    }

    return (
        <div>
            <Head>
                <title>Sign Up</title>
                <meta name = "viewport" content = "initial-scale=1.0, width=device-width"></meta>
            </Head>
            <div className='signupform--container'>
                <form onSubmit={handleSubmit} className='signupform' autoComplete='off'>
                    <h1 className = "signupform--title">Sign Up</h1>
                    <label htmlFor='user'>Username</label>
                    <input name = "Username" type = "text" id="user" className='signupform--username' minLength={5} required></input>
                    <label htmlFor='Password'>Password</label>
                    <input name = "Password" id="Password"  type = "password"  className='signupform--password' minLength={8} required></input>
                    <label htmlFor='ConfirmPassword'>Confirm Password:</label>
                    <input name = "PasswordConf" id = "ConfirmPassword" type = "password" className='signupform--passwordconf'></input>
                    {passwordMatch ? null : <p className='error--UserPass'>Passwords Does Not Match</p>}
                    <button type = "submit" className='signupform--submitbutton'><p>Register</p></button>
                    <p className='signupform--signinlink'><small>Already Have An Account? <a href = "SignInForm">Sign In</a></small></p>
                </form>
            </div>
            <footer className='footer'>
                <p><small>Copyright Reza 2022</small></p>
            </footer>
        </div>
    )
}

export default SignUpForm
