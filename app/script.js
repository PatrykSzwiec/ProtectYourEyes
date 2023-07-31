import React, { useState } from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'off',
      prevStatus: null,
      time: 0,
      timer: null,
    };
  }

  // Helper method to format time as mm:ss
  formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds % 60).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
  };

  startWorkTimer = () => {
    this.setState(
      (prevState) => ({
        time: 12, // 20 minutes
        status: 'work',
        prevStatus: prevState.status, // Save the previous status
      }),
      () => {
        this.startTimer();
        if (this.state.prevStatus === 'rest') {
          this.playBell(); // Play the bell sound when switching to 'rest' from 'work'
        }
      }
    );
  };

  startRestTimer = () => {
    this.setState(
      (prevState) => ({
        time: 2, // 20 seconds
        status: 'rest',
        prevStatus: prevState.status, // Save the previous status
      }),
      () => {
        this.startTimer();
        if (this.state.prevStatus === 'work') {
          this.playBell(); // Play the bell sound when switching to 'rest' from 'work'
        }
      }
    );
  };

  startTimer = () => {
    const { status } = this.state;
    clearInterval(this.state.timer); // Clear the previous timer interval

    if (status !== 'off') {
      this.setState({
        timer: setInterval(() => {
          this.setState((prevState) => ({
            time: prevState.time - 1,
          }));
        }, 1000), // Update time every 1 second (1000 ms)
      });

      if (status === 'work') {
        setTimeout(() => {
          this.startRestTimer();
        }, 12000); // 20 minutes
      } else if (status === 'rest') {
        setTimeout(() => {
          this.startWorkTimer();
        }, 2000); // 20 seconds
      }
    }
  };

  stopTimer = () => {
    clearInterval(this.state.timer); // Clear the timer interval
    this.setState({
      status: 'off',
      time: 0,
      timer: null,
      prevStatus: null,
    });
  };

  toggleStatus = () => {
    const { status } = this.state;
    if (status === 'off') {
      this.startWorkTimer();
    } else if (status === 'work') {
      this.stopTimer();
    }
  };

  closeApp(){
    window.close();
  }

  playBell(){
    const bell = new Audio('./sounds/bell.wav');
    bell.play();
  }


  render() {
    const { status, time } = this.state;
    const formattedTime = this.formatTime(time);

    return (
      <div>
        <h1>Protect your eyes</h1>
        { status === 'off' && (
          <div>
            <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
            <p>This app will help you track your time and inform you when it's time to rest.</p>
          </div>
        )}
        { status === 'work' && (<img src="./images/work.png" />)}
        { status === 'rest' && (<img src="./images/rest.png" />)}
        { status !== 'off' && (
          <div className="timer">
            {formattedTime}
          </div>
        )}
        { status === 'off' && (<button className="btn" onClick={this.toggleStatus}>Start</button>)}
        { status !== 'off' && (<button className="btn" onClick={this.toggleStatus}>Stop</button>)}
        <button className="btn btn-close" onClick={this.closeApp}>X</button>
      </div>
    );
  };
};

render(<App />, document.querySelector('#app'));
