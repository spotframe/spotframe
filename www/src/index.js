import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"

import './index.css'

import EntityScreen from './screens/entities/EntityScreen'
import QueueScreen from './screens/queues/QueueScreen'
import ReviewScreen from './screens/review/ReviewScreen'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

import nunjucks from 'nunjucks'
window.template = nunjucks

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  typography: {
  useNextVariants: true,
  },
});


const Spotframe = () => (
  <MuiThemeProvider theme={theme}>
    <Router>
      <div>
        <Route exact path="/" component={EntityScreen} />
        <Route exact path="/entities" component={EntityScreen} />
        <Route exact path="/entities/:entity/queues" component={QueueScreen} />
        <Route exact path="/entities/:entity/queues/:group/:queue" component={ReviewScreen} />
      </div>
    </Router>
  </MuiThemeProvider>
)

ReactDOM.render(<Spotframe />, document.getElementById('root'))
