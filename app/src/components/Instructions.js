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
            <h1>Experiment ({this.props.exptId}): {this.props.duration / 1000} seconds</h1>
            <p className="ph7-l ph5">
              For this experiment, images of faces will flash for <b>{this.props.duration / 1000}</b> seconds.<br></br>
              After each image disappears, answer whether you think the face was real or fake.
            </p>
            <div className="flex flex-row flex-wrap justify-center mb3">{ images }</div>
            <p className="ph7-l ph5">
              The two faces to the left are <b>REAL</b>, and the two faces to the right are <b>FAKE</b>.<br></br>
              Please note that blurring artifacts may be present for both real or fake images.
            </p>
            <button type='button' onClick={() => {this.handleClick()}}>Start</button>
        </div>
    );
  }
}

export default Instructions
