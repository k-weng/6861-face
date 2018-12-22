import React from 'react';
const {serverUrl} = require("./config");

class Results extends React.Component {
  constructor(props) {
    super(props);

  	this.state = {
  		data: []
  	}
  }

  componentDidMount() {
    fetch(`http://${serverUrl}/results`)
    .then(r => r.json())
    .then(r => { this.setState({ data: r }) });
  }

  render() {
    return (
      <div>
        <ul>
        { this.state.data }
        </ul>
      </div>
    );
  }
}

export default Results;
