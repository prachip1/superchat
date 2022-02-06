import React, { useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDu3qNWhZzH_Gbwke-rQ0aD6T82T_M46zw",
  authDomain: "myreactchat-83612.firebaseapp.com",
  projectId: "myreactchat-83612",
  storageBucket: "myreactchat-83612.appspot.com",
  messagingSenderId: "977428386709",
  appId: "1:977428386709:web:e2b5be38f30e4c8bcc1c9c",
  measurementId: "G-SSPFBZ3QJF"

});


const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {

  const [ user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Text Only 💬</h1>
         <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function  SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <>
     <button className='sign-in' onClick = {signInWithGoogle}>Sign In with google</button>
     <p>Be Polite or Be Banned!</p>
    </>
  )

}

function SignOut () {
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>Send </button>

    </form>
  </>)

}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;
  
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://avatars.dicebear.com/api/male/john.svg?background=%230000ff'} />
      <p>{text}</p>
      </div>
  )

}

export default App;
