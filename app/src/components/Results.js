import React from 'react';
const {serverUrl} = require("./config");

class Results extends React.Component {
  constructor(props) {
    super(props);

  	this.state = {
  		user_stats: []
  	}
  }

  componentDidMount() {
    fetch(`http://${serverUrl}/images/plots/user_stats.json`)
    .then(r => r.json())
    .then(r => { this.setState({ user_stats: r }) });
  }

  render() {
    let user_stats_li = Object.keys(this.state.user_stats).map(
      (k, i) => <li key={k}> {k}: {this.state.user_stats[k]} </li>
    );
    return (
      <div>
        <ul style={{ listStyleType: "none" }}>
          { user_stats_li }
        </ul>
        <img src={`http://${serverUrl}/images/plots/user_age.png`} alt="user_age" className="w12 h4"/><br></br>
        <img src={`http://${serverUrl}/images/plots/user_effort.png`} alt="user_effort" className="w12 h4"/><br></br>
        <img src={`http://${serverUrl}/images/plots/accuracy_fpr.png`} alt="accuracy_fpr" className="w6"/><br></br>
        <img src={`http://${serverUrl}/images/plots/gender_accuracy_fpr.png`} alt="gender_accuracy_fpr" className="w6"/><br></br>
      </div>
    );
  }
}

export default Results;
