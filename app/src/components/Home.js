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
        <h1>Welcome to the Experiment!</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Age: 
            <input type="number" name="age" onChange={this.handleChange} />
          </label>
          <select name="gender" onChange={this.handleChange}>
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
