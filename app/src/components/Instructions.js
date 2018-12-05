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
    fetch(`http://nikola.mit.edu:5000/images/experiment/${this.props.exptId}/repr`)
    .then(r => r.json())
    .then(r => { this.setState({ images: r }) });
  }

  handleClick() {
    this.props.onStart();
  }

  render() {
    let images = this.state.images.map(
      (img, i) => <img src={`http://nikola.mit.edu:5000/images/${img}`} alt="face" key={i} className="w4 h4 ph2"/>
    );

    return (
        <div className="mt6">
            <h1>Experiment ({this.props.exptId}): {this.props.duration / 1000} seconds</h1>
            <p className="ph7-l ph5">
              For this experiment, images of faces will flash for <b>{this.props.duration / 1000}</b> seconds.<br></br>
              After each image disappears, answer whether you think the face was real or fake.
            </p>
            <div className="flex flex-row-ns flex-column flex-wrap justify-center items-center mb3 h4-ns h5 content-center">{ images }</div>
            <p className="ph7-l ph5">
              The two faces to the left are <b>REAL</b>, and the two faces to the right are <b>FAKE</b>.<br></br>
              Please note that blurring artifacts may be present for both real or fake images.
            </p>
            <button type='button' onClick={() => {this.handleClick()}}>Start</button>
            <br></br><br></br><br></br>
            <small>All fake images were generated using <a href="https://research.nvidia.com/publication/2017-10_Progressive-Growing-of">NVIDIA's Progressive GAN.</a></small>

          </div>

    );
  }
}

export default Instructions
