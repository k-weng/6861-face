import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Experiment from './Experiment'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/experiment' component={Experiment}/>
        </Switch>
      </div>
    );
  }
}

export default App;
