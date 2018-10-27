import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      messages: [],
      room: '',
      joined: false
    }

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    // EVERYONE IN ROOM
    this.joinRoom = this.joinRoom.bind(this);
    this.joinSuccess = this.joinSuccess.bind(this);
  }
  componentDidMount() {
    this.socket = io();
    this.socket.on('message dispatched', data => {
      this.updateMessage(data);
    })
    // EVERYONE IN ROOM
    this.socket.on('room joined', data => {
      this.joinSuccess()
    })
  }

  updateMessage(messages) {
    console.log(messages)
    this.setState({
      messages: messages
    })
  }

  // EVERYONE 
  // sendMessage() {
  //   this.socket.emit('message sent', {
  //     message: this.state.input,
  //   })
  //  this.setState({input: ''})
  // }

  // EVERYONE BUT ME
  // sendMessage() {
  //   this.socket.emit('message sent', {
  //     message: this.state.input
  //   })
  //   this.setState({
  //     messages: [...this.state.messages, this.state.input],
  //     input: ''
  //   })
  // }

  // EVERYONE IN ROOM
  sendMessage() {
    this.socket.emit('message sent', {
      message: this.state.input,
      room: this.state.room
    })
    this.setState({
      input: ''
    })
  }


  joinRoom() {
    if (this.state.room) {
      this.socket.emit('join room', {
        room: this.state.room
      })
    }
  }
  joinSuccess() {
    console.log('success')
    this.setState({
      joined: true
    })
  }

  render() {
    const { messages } = this.state;
    const messagesDisplay = messages.map((message, i) =>
      <p key={i}>{message}</p>
    )

    return (
      // EVERYONE AND EVERYONE BUT ME
      // <div className="App">
      //   <div className="messagesDisplay">{messagesDisplay}</div>
      //   <input value={this.state.input} onChange={e => {
      //     this.setState({
      //       input: e.target.value
      //     })
      //   }} />
      //   <button onClick={this.sendMessage}>Send</button>
      // </div>

      // EVERYONE IN ROOM 
      <div className="App">
        {this.state.joined ? <h1>My Room: {this.state.room}</h1> : null}
        <div className="messagesDisplay">
          {messagesDisplay}
        </div>
        {
          this.state.joined
            ?
            <div>
              <input value={this.state.input} onChange={e => {
                this.setState({
                  input: e.target.value
                })
              }} />
              <button onClick={this.sendMessage}>Send</button>
            </div>
            :
            <div>
              <input value={this.state.room} onChange={e => {
                this.setState({
                  room: e.target.value
                })
              }} />
              <button onClick={this.joinRoom}>Join</button>
            </div>
        }
      </div>
    );
  }
}

export default App;
