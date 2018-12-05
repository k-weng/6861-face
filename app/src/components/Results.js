import React from 'react';

class Results extends React.Component {
  constructor(props) {
    super(props);

  	this.state = {
  		data: []
  	}
  }

  componentDidMount() {
    fetch(`http://nikola.mit.edu:5000/results`)
    .then(r => r.json())
    .then(r => { this.setState({ data: r }) });
  }

  render() {
    let rows = this.state.data.map(
      (row, i) => <li key={i}>{row}</li>
    );

    return (
      <div>
        <ul>
        { rows }
        </ul>
      </div>
    );
  }
}

export default Results;
