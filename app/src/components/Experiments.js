import React from 'react';
import Experiment from './Experiment';
import Instructions from './Instructions';

class Experiments extends React.Component {
  constructor(props) {
    super(props);

    let exptIds = [1, 2];
    let durations = [100, 500, 1000, 2000, 5000];
    let expts = [];
    exptIds.forEach(e => {
      durations.forEach(d => {
        expts.push({exptId: e, duration: d})
      });
    })

    this.state = {
      images: [],
      currExptIdx: 0,
      expts: expts,
      exptOngoing: false,
    };

    this.startExperiment = this.startExperiment.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:5000/images")
    .then(r => r.json())
    .then(r => { this.setState({ images: r }) })
  }

  startExperiment() {
    this.setState({
      exptOngoing: true
    })
  }

  finishExperiment(data) {
    fetch("http://localhost:5000/images")
    .then(r => r.json())
    .then(r => { 
      this.setState((state) => {
        console.log(r);
        return {
          images: r,
          exptOngoing: false,
          currExptIdx: state.currExptIdx + 1
        }
      })
    })
  }

  render() {
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
