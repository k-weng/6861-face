import React from 'react'

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrls: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/images")
    .then(r => r.json())
    .then(r => { this.setState({ imageUrls: r }) })
  }

  render() {
    return (
      <div>
        <h1>Welcome to the Experiment!</h1>
        <img src="http://localhost:5000/images/test.png" alt="test"/>
      </div>
    )
  }
}

export default Experiment
