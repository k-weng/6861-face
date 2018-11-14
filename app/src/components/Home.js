import React from 'react'
import { withRouter } from 'react-router-dom'

const Button = withRouter(({ history }) => (
  <button
    type='button'
    onClick={() => { history.push('/experiment') }}>
    Start
  </button>
))

const Home = () => (
  <div>
    <h1>Click to start experiment!</h1>
    <Button/>
  </div>
)

export default Home
