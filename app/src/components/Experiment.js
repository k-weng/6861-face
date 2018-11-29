import React from 'react'

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      imageIdx: 0,
      showImage: false,
      seconds: 3,
      results: [],
      done: false
    };

    this.finishExperiment = this.finishExperiment.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.countdown = this.countdown.bind(this);
    this.answer = this.answer.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.countdown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  countdown() {
    var state = { seconds: this.state.seconds - 1 };

    if (state.seconds === 0) {
      clearInterval(this.interval);
      state.showImage = true;
      this.setState(state, () => { this.timeout = setTimeout(this.answer, this.props.duration) });
    } else {
      this.setState(state);
    }
  }

  answer() {
    this.setState({ showImage: false });
  }

  handleClick(ans) {
    let results = this.state.results.concat(ans);
    let score = this.state.score + (ans === this.props.images[this.state.imageIdx][1]);
    let newState = {
      seconds: 3,
      results: results,
      imageIdx: this.state.imageIdx + 1,
      score: score
    }

    if (newState.imageIdx < this.props.images.length) {
      this.setState(newState, () => { this.interval = setInterval(this.countdown, 1000) });
    } else {
      this.setState({
        done: true,
        results: results,
        score: score
      });
    }
  }

  finishExperiment() {
    this.props.onFinish(this.state.results);
  }

  render() {
    let view;
    if (this.state.done) {
      view = (
        <div>
          <div className="pb3">Score: {this.state.score}</div>
          <button type='button' onClick={() => {this.finishExperiment()}}>Next</button>
        </div>
      )
    } else {
      if (this.state.showImage) {
        let imgUrl = this.props.images[this.state.imageIdx][0]
        view = <img src={`http://localhost:5000/images/${imgUrl}`} alt="face" width="256" height="256"/>
      } else if (this.state.seconds === 0) {
        view = (
          <div className="pt6">
              <button type='button' onClick={() => {this.handleClick(1)}} className="mr3">Real</button>
              <button type='button' onClick={() => {this.handleClick(0)}}>Fake</button>
          </div>
        )
      } else {
        view = <div className="f1 fw6 mt5">{this.state.seconds}</div>
      }
    }

    return <div className="pt6">{ view }</div>
  }
}

export default Experiment
