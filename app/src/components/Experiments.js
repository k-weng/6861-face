import React from 'react';
import Experiment from './Experiment';
import Instructions from './Instructions';

class Experiments extends React.Component {
  constructor(props) {
    super(props);

    let exptIds = [1, 2];
    let durations = [5000, 2000, 1000, 500, 250];
    let expts = [];
    exptIds.forEach(e => {
      durations.forEach(d => {
        expts.push({exptId: e, duration: d});
      });
    });

    this.state = {
      images: [],
      currExptIdx: 0,
      expts: expts,
      exptOngoing: false,
      exptsDone: false,
      numImgs: 6
    };

    this.startExperiment = this.startExperiment.bind(this);
  }

  componentDidMount() {
    let exptId = this.state.expts[this.state.currExptIdx].exptId;
    fetch(`http://localhost:5000/images/experiment/${exptId}?n=${this.state.numImgs}`)
    .then(r => r.json())
    .then(r => { this.setState({ images: r }) });
  }

  startExperiment() {
    this.setState({ exptOngoing: true });
  }

  finishExperiment(data) {
    let expt = this.state.expts[this.state.currExptIdx];
    let payload = {
      gender: this.props.location.state.gender,
      age: this.props.location.state.age,
      results: data,
      images: this.state.images,
      duration: expt.duration
    }

    fetch(`http://localhost:5000/experiment/${expt.exptId}`, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (this.state.currExptIdx < this.state.expts.length - 1) {
      fetch(`http://localhost:5000/images/experiment/${expt.exptId}?n=${this.state.numImgs}`)
      .then(r => r.json())
      .then(r => { 
        this.setState({
            images: r,
            exptOngoing: false,
            currExptIdx: this.state.currExptIdx + 1
        });
      });
    } else {
      this.setState({exptsDone: true});
    }
  }

  render() {
    if (this.state.exptsDone) { return <h1>All Done! Thanks!</h1> }

    let expt = this.state.expts[this.state.currExptIdx];
    return this.state.exptOngoing 
      ? <Experiment exptId={expt.exptId}
                    duration={expt.duration}
                    images={this.state.images}
                    onFinish={(data) => {this.finishExperiment(data)}}/>
      : <Instructions exptId={expt.exptId}
                      duration={expt.duration}
                      onStart={() => {this.startExperiment()}}/>
  }
}

export default Experiments
