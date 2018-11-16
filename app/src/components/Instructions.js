import React from 'react';

class Instructions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: []
    }
    
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch(`http://localhost:5000/images/experiment/${this.props.exptId}/repr`)
    .then(r => r.json())
    .then(r => { this.setState({ images: r }) });
  }

  handleClick() {
    this.props.onStart();
  }

  render() {
    let images = this.state.images.map(
      (img, i) => <img src={`http://localhost:5000/images/${img}`} alt="face" key={i} className="w4 h4 ph2"/>
    );
    
    return (
        <div className="mt6">
            <h1>Instructions</h1>
            <p className="ph7-l ph5">
              For this experiment, images (like the ones below) will flash for <b>{this.props.duration / 1000}</b> seconds.
              After showing an image, answer whether you think the flashed image was real or fake.
            </p>
            <div className="flex flex-row flex-wrap justify-center mb3">{ images }</div>
            <button type='button' onClick={() => {this.handleClick()}}>Start</button>
        </div>
    );
  }
}

export default Instructions
