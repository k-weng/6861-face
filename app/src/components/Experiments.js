import React from 'react';
import Experiment from './Experiment';
import Instructions from './Instructions';

class Experiments extends React.Component {
  constructor(props) {
    super(props);

    let exptIds = [1];
    let durations = [100];
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
      exptsDone: false
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
    if (this.state.currExptIdx < this.state.expts.length - 1) {
      fetch("http://localhost:5000/images")
      .then(r => r.json())
      .then(r => { 
        this.setState((state) => {
          return {
            images: r,
            exptOngoing: false,
            currExptIdx: state.currExptIdx + 1
          }
        })
      })
    } else {
      this.setState({exptsDone: true});
    }
  }

  render() {
    if (this.state.exptsDone) {
      return <h1>All Done!</h1>
    }

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
