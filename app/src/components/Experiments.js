import React from 'react';
import Experiment from './Experiment';
import Instructions from './Instructions';
import Report from './Report'
const {serverUrl} = require("./config");

class Experiments extends React.Component {
  constructor(props) {
    super(props);

    let exptIds = [1,2];
    let durations = [5000,2000,1000,500,250];
    let expts = [];
    let resultsMap = {};

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }

    exptIds.forEach(e => {
      let eDict = {};
      durations.forEach(d => {
        eDict[d] = null;
      });
      resultsMap[e] = eDict;
    });

    exptIds = shuffle(exptIds);
    exptIds.forEach(e => {
      durations = shuffle(durations);
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
      numTrials: durations.length,
      resultsMap: resultsMap
    };

    this.startExperiment = this.startExperiment.bind(this);
  }

  componentDidMount() {
    let urls = this.state.exptIds.map(e =>
      `http://${serverUrl}/images/experiment/${e}?n=${this.state.numImgs * this.state.numTrials}`
    );
    Promise.all(urls.map(u =>
      fetch(u).then(r => r.json())
    )).then(r => {
      r.forEach(s => {
        s.forEach(i => {
          const img = new Image();
          img.src = `http://${serverUrl}/images/${i[0]}`;
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

  finishExperiment(data, score) {

    let expt = this.state.expts[this.state.currExptIdx];
    let resultsMap = this.state.resultsMap;

    resultsMap[expt.exptId][expt.duration] = score;
    this.setState({
      resultsMap: resultsMap
    });

    let payload = {
      uid: this.props.location.state.uid,
      gender: this.props.location.state.gender,
      age: this.props.location.state.age,
      expert: this.props.location.state.expert,
      results: data,
      images: this.state.images,
      duration: expt.duration
    }

    fetch(`http://${serverUrl}/experiment/${expt.exptId}`, {
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
    // console.log(this.state);
    // console.log(this.props);

    if (this.state.exptsDone) { 
      return <Report resultsMap={this.state.resultsMap} numImgs={this.state.numImgs}/>
    }

    let expt = this.state.expts[this.state.currExptIdx];
    return this.state.exptOngoing
      ? <Experiment exptId={expt.exptId}
                    duration={expt.duration}
                    images={this.state.images}
                    numImgs={this.state.numImgs}
                    onFinish={(data, score) => {this.finishExperiment(data, score)}}/>
      : <Instructions exptId={expt.exptId}
                      duration={expt.duration}
                      onStart={() => {this.startExperiment()}}/>
  }
}

export default Experiments
