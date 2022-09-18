import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import logo from './logo.svg';
import SignUp from './components/SignUp/SignUp';
import EditUser from './components/EditUser/EditUser';
import MyImage from './images/placeholder-square.jpg';

import { fireApp, auth, firestore } from './services/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const App = () => {
  const [user] = useAuthState(auth);

  const current = user ? auth.currentUser.displayName : 'guest';

  return (
    <div className="app">
      <Router>
        <header>
          <Link to="/" className='logo'>
            <img src={logo} alt="home"/>
            <h1>Chat App</h1>
          </Link>
            <p>Welcome {current}</p>
          <div>
            {user ? (
            <Link to="/user/edit">
              Edit user
            </Link>
            ) : (
              <Link to="/login">
                Sign in
              </Link>
            ) }
            <SignOut />
          </div>
        </header>
        <section className="content">
          <Switch>
            <Route path="/login">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/user/edit">
              <EditUser />
            </Route>
            <Route path="/">
              <ChatRoom user={user} />
            </Route>
          </Switch>
          <ToastContainer />
        </section>
      </Router>
    </div>
  );
};

// Renders app. StrictMode enforces safe code/apis from react.
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

function SignIn() {
  const [ userEmail, setUserEmail ] = useState('');
  const [ userPass, setUserPass ] = useState('');

  const handleEmail = (e) => {
    setUserEmail(e.currentTarget.value)
  }

  const handlePass = (e) => {
    setUserPass(e.currentTarget.value)
  }

  const signInWithEmail = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, userEmail, userPass);
    handleEmail("");
    handlePass("");
  }

  return (
    <>
      <h2 className='page-title'>Log In</h2>
      <form onSubmit={signInWithEmail} name='login_form' className='user-form'>
        <input name="email" type="email" placeholder="Enter email..." value={userEmail} onChange={handleEmail} />
        <input name="password" type="password" placeholder="Enter password..." value={userPass} onChange={handlePass}/>
        <button>Sign in</button>
      </form>
      <p>No account? <Link to="/signup">Sign up here</Link></p>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(user) {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    if (user.user) {
      const { uid, email, photoURL, displayName } = auth.currentUser;

      await messagesRef.add({
        text: formValue,
        createdAt: fireApp.firestore.FieldValue.serverTimestamp(),
        uid,
        email,
        photoURL,
        name: displayName,
      })

      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

  }

  return (
    <>
      <main className="chat-room">

        {messages && messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}

        <span ref={dummy}></span>

      </main>

      {user.user && (
        <form onSubmit={sendMessage} className="send-form">
          <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type message..." />

          <button type="submit" disabled={!formValue} className="secondary">Submit</button>
        </form>
      )}
    </>
  )
}


function ChatMessage(props) {
  const { text, uid, name, photoURL } = props.message;

  const messageClass = auth.currentUser ? uid === auth.currentUser.uid ? 'sent' : 'received' : '';

  const image = photoURL ? photoURL : MyImage;

  return (
    <>
      <div className={`message ${messageClass}`}>
        <div className="user">
          <img alt="" src={image} width="60" />
        </div>
        <div className="bubble">
          <p className="name">{name} {auth.currentUser ? uid === auth.currentUser.uid ? '(you)' : '' : ''}</p>
          <p className="text">{text}</p>
        </div>
      </div>
    </>
  )
}
