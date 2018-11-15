import React from 'react'

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIdx: 0,
      showImage: false,
      seconds: 3
    };

    this.handleClick = this.handleClick.bind(this);
    this.countdown = this.countdown.bind(this);
    this.showButtons = this.showButtons.bind(this);
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
      this.setState(state, () => {
        this.timeout = setTimeout(this.showButtons, this.props.duration)
      });
    } else {
      this.setState(state);
    }
  }

  showButtons() {
    this.setState({
        showImage: false,
        imageIdx: this.state.imageIdx + 1
    });
  }

  handleClick() {
    if (this.state.imageIdx < this.props.images.length) {
      this.setState({ seconds: 3 }, () => {
        this.interval = setInterval(this.countdown, 1000);
      });
    } else {
      this.props.onFinish("Done");
    }
  }

  render() {
    if (this.state.showImage) {
      let imgUrl = this.props.images[this.state.imageIdx][0]
      return <img src={`http://localhost:5000/images/${imgUrl}`} alt="face"/>
    } else if (this.state.seconds === 0) {
      return (
        <div>
            <button type='button' onClick={() => {this.handleClick()}}>Real</button>
            <button type='button' onClick={() => {this.handleClick()}}>Fake</button>
        </div>
      )
    } else {
      return <div>{this.state.seconds}</div>
    }
  }
}

export default Experiment
