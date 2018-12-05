import React from 'react'

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      age: 0,
      gender: 'male'
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push({
      pathname: '/experiment',
      state: {
        gender: this.state.gender,
        age: this.state.age
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Welcome to the Real/Fake Face study!</h1>

	<small>This study contains 2 experiments, each of which measures your classification accuracy under 5 image exposure times [5s, 2s, 1s, 500ms, 250ms].</small>
        <br></br><br></br><br></br>
	<form onSubmit={this.handleSubmit}>
          <label>
            Age:
            <input type="number" name="age" min="18" max="99" onChange={this.handleChange} className="ml2 w3"/>
          </label>
          <select name="gender" onChange={this.handleChange} className="mh3">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

export default Home
