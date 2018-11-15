import React from 'react'

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIdx: 0,
      showImage: false,
      seconds: 3,
      results: []
    };

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
    let newState = {
      seconds: 3,
      results: results,
      imageIdx: this.state.imageIdx + 1
    }

    if (newState.imageIdx < this.props.images.length) {
      this.setState(newState, () => { this.interval = setInterval(this.countdown, 1000) });
    } else {
      this.props.onFinish(results);
    }
  }

  render() {
    if (this.state.showImage) {
      let imgUrl = this.props.images[this.state.imageIdx][0]
      return <img src={`http://localhost:5000/images/${imgUrl}`} alt="face"/>
    } else if (this.state.seconds === 0) {
      return (
        <div>
            <button type='button' onClick={() => {this.handleClick(1)}}>Real</button>
            <button type='button' onClick={() => {this.handleClick(0)}}>Fake</button>
        </div>
      )
    } else {
      return <div>{this.state.seconds}</div>
    }
  }
}

export default Experiment
