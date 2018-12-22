import React from 'react';

class Report extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  	let rows = []

  	for(var exptId in this.props.resultsMap) {
  		for (var duration in this.props.resultsMap[exptId]) {
  			let score = this.props.resultsMap[exptId][duration];
  			let numImgs = this.props.numImgs;
  			let perc = (100.0*score/numImgs).toFixed(1);
  			let key = `${exptId}-${duration}`;
  			rows.push(
  				<li key={key}>Experiment {exptId}, {duration} ms: {perc}% ({score}/{numImgs})</li>
  			);
  		}
		}
      
    return (
      <div className="mt6">
      	<h1> Thanks for taking the test! </h1><br></br>
      	<ul style={{ listStyleType: "none" }}>
	        { rows }
        </ul>
      </div>
    );
  }
}

export default Report;
