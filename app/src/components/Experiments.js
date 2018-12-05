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
      exptIds: exptIds,
      imageSets: [],
      images: [],
      currExptIdx: 0,
      currImgSetIdx: 0,
      expts: expts,
      exptOngoing: false,
      exptsDone: false,
      numImgs: 6,
      numTrials: durations.length
    };

    this.startExperiment = this.startExperiment.bind(this);
  }

  componentDidMount() {
    let urls = this.state.exptIds.map(e =>
      `http://nikola.mit.edu:5000/images/experiment/${e}?n=${this.state.numImgs * this.state.numTrials}`
    );
    Promise.all(urls.map(u =>
      fetch(u).then(r => r.json())
    )).then(r => {
      r.forEach(s => {
        s.forEach(i => {
          const img = new Image();
          img.src = `http://nikola.mit.edu:5000/images/${i[0]}`;
        })
      })
      this.setState({
        imageSets: r
      })
    });
  }

  startExperiment() {
    let imageSets = this.state.imageSets;
    let images = imageSets[this.state.currImgSetIdx].splice(0, this.state.numImgs);
    this.setState({
      exptOngoing: true,
      images: images,
      imageSets: imageSets
    });
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

    fetch(`http://nikola.mit.edu:5000/experiment/${expt.exptId}`, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (this.state.currExptIdx < this.state.expts.length - 1) {
      this.setState({
        exptOngoing: false,
        currExptIdx: this.state.currExptIdx + 1,
        currImgSetIdx: this.state.imageSets[this.state.currImgSetIdx].length === 0
          ? this.state.currImgSetIdx + 1 : this.state.currImgSetIdx
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
