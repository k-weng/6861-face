import React from 'react'

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageIdx: 0,
      hideImage: false
    };

    this.showButtons = this.showButtons.bind(this)
    this.nextImage = this.nextImage.bind(this)
  }

  componentDidMount() {
    fetch("http://localhost:5000/images")
    .then(r => r.json())
    .then(r => { this.setState({ images: r }) })

    this.timeout = setTimeout(
      this.showButtons,
      500
    )
  }

  showButtons() {
    this.setState((state) => {
      return {
        hideImage: true,
        imageIdx: state.imageIdx + 1}
    });
  }

  nextImage() {
    if (this.state.imageIdx < this.state.images.length) {
      this.setState({
        hideImage: false
      }, () => {
        this.timeout = setTimeout(
          this.showButtons,
          500
        )
      })
    } else {
      alert("No more images")
    }
  }

  render() {
    var view = !this.state.hideImage 
      ? <img src={`http://localhost:5000/images/${this.state.images[this.state.imageIdx]}`} alt="face"/>
      : <div>
        <button type='button' onClick={() => { this.nextImage() }}> Real </button>
        <button type='button' onClick={() => { this.nextImage() }}> Fake </button>
      </div>

    return <div>{ view }</div>
  }
}

export default Experiment
