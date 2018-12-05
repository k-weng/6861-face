import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Experiments from './Experiments'
import Results from './Results'

class App extends Component {
  render() {
    return (
      <div className="tc">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/experiment' component={Experiments}/>
          <Route exact path='/results' component={Results}/>
        </Switch>
      </div>
    );
  }
}

export default App;
