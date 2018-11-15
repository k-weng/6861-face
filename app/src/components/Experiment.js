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
    this.nextImage = this.nextImage.bind(this);
    this.countdown = this.countdown.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.countdown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  countdown() {
    var state = {
      seconds: this.state.seconds - 1
    };

    if (state.seconds === 0) {
      clearInterval(this.interval);
      state.showImage = true;
    }

    this.setState(state);
  }

  handleClick() {
    if (this.state.imageIdx < this.props.images.length) {
        this.setState({
            
        })
    }
    this.props.onFinish("Done");
    // this.setState((state) => {
    //   return {
    //     hideImage: true,
    //     imageIdx: state.imageIdx + 1}
    // });
  }

  nextImage() {
    if (this.state.imageIdx < this.props.images.length) {
      this.setState({
        hideImage: false
      }, () => {
        this.timeout = setTimeout(
          this.showButtons,
          5000
        )
      })
    } else {
      alert("No more images")
    }
  }

  render() {
    // var view = !this.state.hideImage 
    //   ? <img src={`http://localhost:5000/images/${this.state.images[this.state.imageIdx]}`} alt="face"/>
    //   : <div>
    //     <button type='button' onClick={() => { this.nextImage() }}> Real </button>
    //     <button type='button' onClick={() => { this.nextImage() }}> Fake </button>
    //   </div>
    // return <div>{ view }</div>

    return (
        <div>
            <div>{this.state.countdown}</div>
            <button type='button' onClick={() => { this.handleClick() }}> Real </button>
            <button type='button' onClick={() => { this.handleClick() }}> Fake </button>
        </div>
    );
  }
}

export default Experiment
