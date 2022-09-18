import React, { useState } from 'react';
import { updateProfile } from "firebase/auth";
import { firestore, auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';


export function updateUser(user, name, img) {
  const messagesRef = firestore.collection('messages');
  const image = img ? "https://hotw.microserve.io/images/" + img : '';

  updateProfile(user, {
    displayName: name ,
    photoURL: image
  }).then(() => {
    messagesRef.where('uid', '==' , user.uid).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
          name: name,
          photoURL: image
        });
      });

      toast.success('User has been updated');
    });
    // Profile updated!
  }).catch((error) => {
    toast.error(error.message);
  });
}

const EditUser = () => {
  const [ user ] = useAuthState(auth);
  const [ userName, setUserName ] = useState('');
  const [ userImage, setUserImage ] = useState('');

  const handleName = (e) => {
    setUserName(e.currentTarget.value)
  }

  const handleImage = (e) => {
    setUserImage(e.currentTarget.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(user, userName, userImage);
    if (userName !== '') {
      setUserName("");
    }
    if (userImage !== '') {
     setUserImage("");
    }
  }

  return (
    <>
      <h2 className='page-title'>Edit User</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <label htmlFor="name">Name:</label>
        <input name="name" type="text" placeholder="Enter name..." value={userName} onChange={handleName} />
        <label htmlFor="image">Image URL:</label>
        <input name="image" type="text" placeholder="Enter photo url..." value={userImage} onChange={handleImage}/>
        <button type="submit">Update</button>
      </form>
    </>
  )
}

export default EditUser;
