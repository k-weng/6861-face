import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Experiments from './Experiments'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/experiment' component={Experiments}/>
        </Switch>
      </div>
    );
  }
}

export default App;
