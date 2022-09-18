import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignUp = () => {
  const auth = getAuth();
  const history = useHistory();

  if (auth.currentUser) {
    history.push("/");
  }

  const [ userEmail, setUserEmail ] = useState('');
  const [ userPass, setUserPass ] = useState('');
  const [ userName, setUserName ] = useState('');

  const handleEmail = (e) => {
    setUserEmail(e.currentTarget.value)
  }

  const handleName = (e) => {
    if (e.currentTarget.value !== '') {
      setUserName(e.currentTarget.value)
    }
  }

  const handlePass = (e) => {
    setUserPass(e.currentTarget.value)
  }

  const signUpWithEmail = (e) => {
    e.preventDefault();
    toast.error('Sorry, sign up is disabled');
    // createUserWithEmailAndPassword(auth, userEmail, userPass).then((user) => {
    //   updateProfile(user.user, {
    //     displayName: userName,
    //   });
    //   setUserName("");
    //   setUserEmail("");
    //   setUserPass("");
    //   history.push("/");
    // }, (error) => {
    //   const errorCode = error.code;
    //   if (errorCode == 'auth/weak-password') {
    //     toast.error('The password is too weak.');
    //   } else if (errorCode == 'auth/email-already-in-use') {
    //     toast.error('This email is in use.');
    //   } else {
    //     console.error(error);
    //   }
    // });
  }

  return (
    <>
      <h2 className='page-title'>Sign up</h2>
      <form onSubmit={signUpWithEmail} name='login_form' className='user-form'>
        <input name="name" type="text" placeholder="Enter name..." value={userName} onChange={handleName} required />
        <input name="email" type="email" placeholder="Enter email..." value={userEmail} onChange={handleEmail} required />
        <input name="password" type="password" placeholder="Enter new password..." value={userPass} onChange={handlePass} required />
        <button>Sign up</button>
      </form>
    </>
  )
};

export default SignUp;
