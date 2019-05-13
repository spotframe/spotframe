import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import Helpers from './helpers'
import axios from 'axios'
import webstomp from 'webstomp-client'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import ArrowBack from '@material-ui/icons/ArrowBack'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Inbox from '@material-ui/icons/Inbox'

import MainBar from '../../components/MainBar'
import TimeoutBar from '../../components/TimeoutBar'

import Button from '@material-ui/core/Button'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import NoSsr from '@material-ui/core/NoSsr'

import JsxParser from 'react-jsx-parser'
import All from '../../components/spotframe/All'



const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},

  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },

  rightIcon: {
    marginLeft: theme.spacing.unit,
  },

  button: {
    margin: theme.spacing.unit,
  },

  nextButton: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },

  noMessages: {
    display: 'flex',
    padding: 100,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ccc',
  },

  inboxIcon: {
    width: 48,
    height: 48,
  }

})

const timeToReview = 0

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
}



class ReviewScreen extends Component {

  state = {
    value: 0,
    message: null,
    messages: [],
    frames: {},
    backends: {},
    expanded: null,
    broker: null,
    expire: false,
    queues: [],
    interval: null,
  }

  componentWillUnmount() {
    this.state.broker.disconnect()
    this.setState({broker: null})
  }

  componentDidMount() {

    let { entity, group, queue } = this.props.match.params

    var broker = webstomp.client(
      `ws://${process.env.REACT_APP_BROKER_HOST}:15674/ws`
    )

    broker.debug = () => {}

    this.setState({ broker })


    axios.get(`${process.env.REACT_APP_BACKEND_URL}/queues/${entity}`)
      .then(res => {
        let queues = Object.fromEntries(
          Object.entries(res.data[group][queue]).map(
            ([key, params]) => ([key, (params ? params.messages : null)])
          )
        )

        let valid_queues = Object.keys(
          Object.fromEntries(
            Object.entries(queues).filter(
              ([_, messages]) => messages !== null)
          ))

        broker.connect(
          process.env.REACT_APP_BROKER_USER,
          process.env.REACT_APP_BROKER_PASS,
          (onConnect) => {

            valid_queues.forEach(qname => {
              this.consumeMessage(broker, qname, ([_, message]) => {
                this.setState({ messages: [message, ...this.state.messages] })

                if (!this.state.message) {

                  let first = this.state.messages[0]
                  this.setState({
                    message: first,
                    messages: this.state.messages.slice(1)
                  })

                  axios.get(`${process.env.REACT_APP_BACKEND_URL}/frames/${JSON.parse(first.body).uuid}`)
                    .then(res => { this.setState({
                      frames: res.data.frames,
                      backends: res.data.backends
                    }) })

                }

              })
            })

          }
        )

      })

  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  consumeMessage = (broker, queue, onMessage) => {
    let subscription = broker.subscribe(
      `/queue/${queue}`,
      (message) => {
        return onMessage([subscription, message])
      },
      {
        ack: 'client',
        'prefetch-count': 1
      }
    )
  }

  ackMessage = (message, messages) => {

    message.ack()
    this.setState({
      message: null,
      frames: {},
      backends: {},
    })

    if (messages.length !== 0) {
      let first = messages[0]

      this.setState({
        message: first,
        messages: this.state.messages.slice(1),
      })

      axios.get(`${process.env.REACT_APP_BACKEND_URL}/frames/${JSON.parse(first.body).uuid}`)
        .then(res => { this.setState({
          frames: res.data.frames,
          backends: res.data.backends
        }) })
    }
  }

  render() {

    const { classes } = this.props
    const { value } = this.state

    if (this.state.expire) {
      this.state.broker.disconnect()
      this.setState({broker: null})
      return <Redirect to={`/entities/${this.props.match.params.entity}/queues`} query="" />
    }

    return (

      <NoSsr>

        <MainBar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <Link
              to={`/entities/${this.props.match.params.entity}/queues`}
              query=""
              style={{textDecoration: 'none', color: 'white', height: 24}}
            >
              <ArrowBack onClick={() => this.setState({expire: true})} />
            </Link>
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {this.props.match.params.group} / {this.props.match.params.queue}
          </Typography>

        </MainBar>

        <TimeoutBar minutes={timeToReview} />

        <div className={classes.root}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          >

          {
            Object.entries(this.state.frames).map(([frame, _], index) =>
              <Tab
                key={index}
                disableRipple
                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                label={Helpers.titleize(frame)}
              />
            )
          }

          </Tabs>

          {

            Object.entries(this.state.frames).map(([frame, components], index) =>
              (
                value === index &&
                <TabContainer key={index} id={`cont${index}`}>
                  <JsxParser
                      bindings={{
                      }}
                      components={All}
                      jsx={Helpers.htmlize(components)}
                    />
                </TabContainer>
              )
            )

          }

          { (this.state.message === null ?
            <div className={classes.noMessages}>
              <Inbox className={classes.inboxIcon} />
              <Typography variant="h6" color="inherit">
                There is no messages by now...
              </Typography>
            </div>
            : '') }

        </div>

        <div className={classes.nextButton}>
          <Button
            variant="contained"
            color="primary"
            disabled={this.state.message === null}
            className={classes.button}
            onClick={() => this.ackMessage(this.state.message, this.state.messages)}
          >
            Next {Helpers.titleize(this.props.match.params.entity)} <ChevronRight />
          </Button>

        </div>

      </NoSsr>
    )

  }
}

ReviewScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReviewScreen)
