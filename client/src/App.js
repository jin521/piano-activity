import React, { Component } from 'react';
import Piano from './Piano.js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNote: null,
      allAttempts: []
    }

    this.props.fetchNextNote().then((data) => {
      this.setState({currentNote: data.note});
    }).catch((err) => {
      this.setState({error: 'Unable to connect to the server'});
    });
  }

  onPress = (octave, keyNames) => {
    this.props.checkAnswer(keyNames).then((data) => {
        this.setState(
          {
           allAttempts: [...this.state.allAttempts, keyNames],
           error: null
          });

        if (data && data.status) {
          this.props.fetchNextNote().then((data) => {
            this.setState({currentNote: data.note});
          }).catch((err) => {
            this.setState({error: 'Unable to connect to the server'});
          });

          if (!data.next) {
            alert('that is all ! lets re-do this exercise')
            this.setState({
              allAttempts: []
            })
          }
        } else {
          alert('wrong key, try again')
        }
      }).catch((err) => {
        this.setState({error: 'unable to connect to the server'});
      });
  }

  getNote() {
    return this.state.currentNote.replace('#', '♯').replace('b', '♭');
  }

  getAllAttempts() {
    if (this.state.allAttempts) {
      return this.state.allAttempts.map((attemp) =>
        <li key={attemp.toString()}>{attemp}</li>
      )
    }
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.error ? `An error occurred: ${this.state.error}` : null}

          {
            this.state.currentNote ?
              <div className="App-note-name-display">{this.getNote()}</div>
            :
              <div className="App-note-loading">loading...</div>
          }
          When a note appears above, play the corresponding note on the piano keyboard.
        </header>
        <Piano
          numOctaves={3}
          onPress={this.onPress.bind(this)}
        />
        <h2> all your attempts: </h2>
          <h5> {this.getAllAttempts()}</h5>
      </div>
    );
  }
}

export default App;
