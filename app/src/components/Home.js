import React from 'react'
var crypto = require("crypto");

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: crypto.randomBytes(16).toString('hex'),
      age: null,
      gender: "male",
      expert: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.age) {
      this.props.history.push({
        pathname: '/experiment',
        state: {
          uid: this.state.uid,
          gender: this.state.gender,
          age: this.state.age,
          expert: this.state.expert,
        }
      });
    } else {
      alert("Please fill out all fields.");
    }
  }

  render() {
    return (
      <div>
        <h1>Welcome to the Real/GAN-Generated Face test!</h1>

        <small>
        This test contains 2 experiments, each of which measures your classification accuracy 
        under 5 image exposure times [5s, 2s, 1s, 500ms, 250ms]. <br></br>
        Experiment and exposure time order will be randomized. <br></br>
        You may stop at any point you like, but a full summary of your results will be available at the end.
        </small>
        <br></br><br></br><br></br>

	      <form onSubmit={this.handleSubmit}>
          <label>
            Age
            <input type="number" name="age" min="18" max="99" onChange={this.handleChange} className="ml2 w3"/>
          </label><br></br><br></br>
          <label>
            Gender
            <select name="gender" onChange={this.handleChange} className="mh3">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label><br></br><br></br>
          <label>
            Are you familiar with GAN imagery?
            <select name="expert" onChange={this.handleChange} className="mh3">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label><br></br><br></br>
          <input type="submit" value="Start Test!"/>
        </form>
      </div>
    )
  }
}

export default Home
