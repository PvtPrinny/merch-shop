import { useState } from 'react'
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'

export const Auth = () => {
    const [loginEmail,setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerEmail,setRegisterEmail] = useState("");
    const [registerPassword,setRegisterPassword] = useState("");

    const [errorMessage,setErrorMessage] = useState("");
    const [toggleRegister,setToggleRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // tickbox to show/hide password

    const register = async () => {
        if (registerPassword.length < 6) {
          setErrorMessage("Password must be at least 6 characters long.");
        return;
    }
        try{
            await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
        }catch(err) {
            console.error(err);
            setErrorMessage("Invalid Email or Password!");
        }
    };

    const login = async () => {
        try{
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        }catch(err) {
            console.error(err);
            setErrorMessage("Invalid Email or Password!");
        }
    };

    // console.log(auth.currentUser.email); check who's the current user's email

    const signInWithGoogle = async () => {
      try{
        await signInWithPopup(auth, googleProvider);
      }catch(err){
        console.error(err);
      }
    };

    const signOut = async () => {
      try{
        await signOut(auth);
      }catch(err){
        console.error(err);
      }
    }
    
    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    };

  return (
    <div className="auth-form">
      {!toggleRegister && <div>
        <h1>Sign-In</h1>
        <br />
        <br />
        <input 
          placeholder='Email...' 
          onChange={(e) => {
            setLoginEmail(e.target.value);
            setErrorMessage("");
          }}
        />
        <br />
        <br />
        <input 
          type={showPassword ? "text" : "password"}
          placeholder="Password..." 
          onChange={(e) => {
            setLoginPassword(e.target.value);
            setErrorMessage("");
          }}
        />
        <br />
        <div className='show-password'>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handleShowPassword}
          />
          <h4>Show Password?</h4>
        </div>
        {errorMessage && <div className={`"LoginError"${errorMessage ? "show" : ""}`} style={{color: 'red'}}>{errorMessage}</div>}
        {!errorMessage && <br/>}
        <br />
        <button onClick={login} >Sign in</button>
        {'\u00A0'}
        {'\u00A0'}
        {'\u00A0'}
        {'\u00A0'}
        {'\u00A0'}
        <button onClick={signInWithGoogle}>Sign in with Google</button>
        <br />
        <br />
        <h5>Don't have an account yet?   <button className="toggle-register" onClick={()=>{setToggleRegister(true); setErrorMessage(""); setShowPassword(false);}}>Register</button></h5>
      </div>}
      {toggleRegister && <div><h1>Create an Account</h1>
        <br />
        <br />
        <input 
          placeholder='Email...' 
          onChange={(e) => {
            setRegisterEmail(e.target.value);
            setErrorMessage("");
          }}
        />
        <br />
        <br />
        <input 
          type={showPassword ? "text" : "password"}
          placeholder="Password..." 
          onChange={(e) => {
            setRegisterPassword(e.target.value);
            setErrorMessage("");
          }}
        />
        <br />
        <div className='show-password2'>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handleShowPassword}
          />
          <h4>Show Password?</h4>
        </div>
        {errorMessage && <div className={`"LoginError"${errorMessage ? "show" : ""}`} style={{color: 'red'}}>{errorMessage}</div>}
        {!errorMessage && <br/>}
        <br />
        <button onClick={register} >Create Account</button>
        {/* <button onClick={signInWithGoogle}>Sign in with Google</button> */}
        {/* <button onClick={signOut}>Logout</button> */}
        <br />
        <br />
        <h5>Already have an account?      <button className="toggle-register" onClick={()=>{setToggleRegister(false); setErrorMessage(""); setShowPassword(false);}}>Log In</button></h5>
      </div>}
    </div>
  )
}
