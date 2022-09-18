import React, { useState} from "react";
import firebase from 'firebase/compat/app';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../services/firebase';


const LoginForm = ({ currentUser }) => {
  const [ userEmail, setUserEmail ] = useState('');
  const [ userPass, setUserPass ] = useState('');

  const handleEmail = (e) => {
    setUserEmail(e.currentTarget.value)
  }

  const handlePass = (e) => {
    setUserPass(e.currentTarget.value)
  }

  const signInWithGoogle = (e) => {
    e.preventDefault();
    // const auth = getAuth();
    signInWithEmailAndPassword(auth, userEmail, userPass)
    .then((userCredential) => {
      // Signed in
      currentUser(userCredential.user);
      // console.log(user);
      handleEmail("");
      handlePass("");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage);
    });
  }

  return (
    <form onSubmit={signInWithGoogle} name='login_form'>
      <input name="email" type="email" placeholder="Enter email..." value={userEmail} onChange={handleEmail} />
      <input name="password" type="password" placeholder="Enter password..." value={userPass} onChange={handlePass}/>
      <button>Sign in</button>
    </form>
  )
};

export default LoginForm;
