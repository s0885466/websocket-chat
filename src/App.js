import React, {Component} from 'react';
import openSocket from 'socket.io-client';
import './App.css';

class App extends Component {
  state = {
    isName: false,
    name: '',
    message: '',
    text: []
  };

  socket = openSocket('http://localhost:8000');

  componentDidMount() {
    this.socket.on('dataFromServer', data => {
      this.setState({text: data});
    });
  }

  send = () => {
    const {name, message} = this.state;
    const fullMessage = {
      name,
      message,
      date: new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
    };
    this.socket.emit('dataToServer', fullMessage);
  };

  changeHandlerName = e => {
    this.setState({name: e.target.value});
  };

  changeHandlerMessage = e => {
    this.setState({message: e.target.value});
  };

  onBlurName = () => {
    if (this.state.name) {
      this.setState({isName: true});
    } else {
      this.setState({name: 'anonymous', isName: true});
    }
  };

  render() {
    const {isName, name, text, message} = this.state;
    return (
      <div className="App">
        <h1>Web chat</h1>
        <input
          onChange={this.changeHandlerName}
          onBlur={this.onBlurName}
          value={name}
          type="text"
          placeholder="Введите ваше имя"
          disabled={isName}/>
        <input
          onChange={this.changeHandlerMessage}
          value={message}
          type="text"
          placeholder="сообщение"
          disabled={!isName}
        />
        <section>
          <h2>Чатик</h2>
          <div className="message-block">
            {text.reverse().map(fullMessage => (
              <p>
                <b>{fullMessage.name}:</b>
                [{fullMessage.date}]<br/>
                {fullMessage.message}
              </p>
            ))}
          </div>
        </section>
        <button
          onClick={this.send}
        >Сказать
        </button>
      </div>
    );
  }
}

export default App;
