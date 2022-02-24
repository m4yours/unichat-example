
import React, { Component } from 'react';
import UniChat from 'unichatjs';
import './App.css';

class Test extends Component {

  state = {
    myId: '',
    friendId: '',
    unichat: {},
    message: '',
    messages: []
  }

  componentDidMount() {

    const unichat = new UniChat('', {
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

    unichat.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (stream) => {

        this.myVideo.srcObject = stream;
        this.myVideo.play();

        call.answer(stream);

        call.on('stream', (remoteStream) => {
          this.friendVideo.srcObject = remoteStream;
          this.friendVideo.play();
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

  videoCall = () => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (stream) => {

      this.myVideo.srcObject = stream;
      this.myVideo.play();

      const call = this.state.peer.call(this.state.friendId, stream);

      call.on('stream', (remoteStream) => {
        this.friendVideo.srcObject = remoteStream;
        this.friendVideo.play();
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

          <button onClick={this.videoCall}>Video Call</button>
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

        <div className="col">
          <div>
            <video ref={ref => this.myVideo = ref} />
          </div>
          <div>
            <video ref={ref => this.friendVideo = ref} />
          </div>
        </div>

      </div>
    );
  }
}

export default Test;
