import React from 'react';
import Experiment from './Experiment';
import Instructions from './Instructions';

class Experiments extends React.Component {
  constructor(props) {
    super(props);

    let exptIds = [1, 2];
    let exptImgTypes = [['gan', 'real'], ['gan-blur', 'real-blur']];
    let durations = [100, 500, 1000, 2000, 5000];
    let expts = [];
    exptIds.forEach((e, i) => {
      durations.forEach(d => {
        expts.push({exptId: e, duration: d, imgTypes: exptImgTypes[i]});
      });
    });

    this.state = {
      images: [],
      currExptIdx: 0,
      expts: expts,
      exptOngoing: false,
      exptsDone: false,
      numImgs: 10
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
    if (this.state.currExptIdx < this.state.expts.length - 1) {
      let exptId = this.state.expts[this.state.currExptIdx].exptId;
      fetch(`http://localhost:5000/images/experiment/${exptId}?n=${this.state.numImgs}`)
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
    if (this.state.exptsDone) { return <h1>All Done!</h1> }

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
