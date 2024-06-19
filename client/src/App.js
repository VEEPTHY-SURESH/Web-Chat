import React from 'react';
// import GoogleSignIn from './Signin';
import Chat from './Chat/Chat';
import './App.css';

function App() {
  return (
      <div className="App">
        <header className="App-header">
            <h1>Real-Time Chat</h1>
        </header>
        {/* <GoogleSignIn /> */}
        <div className='chat-box'>
            <Chat />
        </div>
        
      </div>
  );
}

export default App;

