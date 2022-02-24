
import React, { Component } from 'react';
import UniChat from 'unichatjs';
import './App.css';

class App extends Component {

  state = {
    myId: '',
    friendId: '',
    unichat: {},
    message: '',
    messages: []
  }

  componentDidMount() {

    const unichat = new UniChat('my-id', {
      host: 'localhost',
      port: '9000',
      path: '/',
    });

    unichat.on('open', (id) => {
      this.setState({
        myId: id,
        unichat: unichat
      });
    });

    unichat.on('connection', (conn) => {
      conn.on('data', (data) => {
        this.setState({
          messages: [...this.state.messages, data]
        });
      });
    });

   
  }

  send = () => {
    const conn = this.state.unichat.connect(this.state.friendId);

    conn.on('open', () => {

      const msgObj = {
        sender: this.state.myId,
        message: this.state.message
      };

      conn.send(msgObj);

      this.setState({
        messages: [...this.state.messages, msgObj],
        message: ''
      });

    });
  }


  render() {
    return (
      <div className="wrapper">
        <div className="col">
          <h1>My ID: {this.state.myId}</h1>

          <label>Friend ID:</label>
          <input
            type="text"
            value={this.state.friendId}
            onChange={e => { this.setState({ friendId: e.target.value }); }} />

          <br />
          <br />

          <label>Message:</label>
          <input
            type="text"
            value={this.state.message}
            onChange={e => { this.setState({ message: e.target.value }); }} />
          <button onClick={this.send}>Send</button>
          {
            this.state.messages.map((message, i) => {
              return (
                <div key={i}>
                  <h3>{message.sender}:</h3>
                  <p>{message.message}</p>
                </div>

              )
            })
          }
        </div>

      </div>
    );
  }
}

export default App;
