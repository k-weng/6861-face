import React from 'react';

class Instructions extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onStart();
  }

  render() {
    return (
        <div>
            <h1>Instructions</h1>
            <p>For experiment {this.props.exptId}, images will flash for {this.props.duration / 1000} seconds</p>
            <button type='button' onClick={() => {this.handleClick()}}>Start</button>
        </div>
    );
  }
}

export default Instructions
