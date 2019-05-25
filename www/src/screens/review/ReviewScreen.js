import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import Helpers from './helpers'
import axios from 'axios'
import webstomp from 'webstomp-client'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import ArrowBack from '@material-ui/icons/ArrowBack'
import ArrowRight from '@material-ui/icons/ArrowRight'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Inbox from '@material-ui/icons/Inbox'

import MainBar from '../../components/MainBar'
import TimeoutBar from '../../components/TimeoutBar'

import Button from '@material-ui/core/Button'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import NoSsr from '@material-ui/core/NoSsr'
import NativeSelect from '@material-ui/core/NativeSelect'
import OutlinedInput from '@material-ui/core/OutlinedInput'

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

  actionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginRight: 10
  },

  moveToQueue: {
    width: 250,
    height: 36,
    margin: 8,
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
  },

  queueTitle: {
    display: 'flex',
    alignItems: 'center',
  },

  arrowDivider: {
    color: "#1565c0",
  }

})


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
    uuid: null,
    value: 0,
    message: null,
    messages: [],
    frames: {},
    expanded: null,
    broker: null,
    expire: false,
    queues: [],
    interval: null,
    timeout: null,
    entity_idle: null,
    time_to_expire: 0,
    moving_queues: {},
  }

  componentWillUnmount() {
    if (this.state.broker !== null) {
      this.state.broker.disconnect()
      this.setState({broker: null})
    }
    if (this.state.timeout !== null) {
      clearTimeout(this.state.timeout)
    }
  }

  componentDidMount() {

    let { entity, group, queue } = this.props.match.params

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/entities/${entity}`)
      .then(res => this.setState({ entity_idle: res.data.idle }))

    var broker = webstomp.client(
      `ws://${process.env.REACT_APP_BROKER_HOST}:15674/ws`
    )

    broker.debug = () => {}

    this.setState({ broker })


    axios.get(`${process.env.REACT_APP_BACKEND_URL}/queues/${entity}`)
      .then(res => {

        this.setState({ moving_queues: res.data })

        let queues = Object.fromEntries(
          Object.entries(res.data[decodeURIComponent(group)][decodeURIComponent(queue)]).map(
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

                  const uuid = JSON.parse(first.body).uuid
                  this.setState({ uuid })

                  axios.get(`${process.env.REACT_APP_BACKEND_URL}/frames/${uuid}`)
                    .then(res => {
                      this.setState({
                        frames: res.data.frames,
                        time_to_expire: this.state.entity_idle,
                      })
                      this.scheduleExpire(this.state.entity_idle)
                    })

                }

              })
            })

          },
          (onError) => {

          },
          entity
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
      uuid: null,
      time_to_expire: 0,
    })

    clearTimeout(this.state.timeout)

    if (messages.length !== 0) {
      let first = messages[0]

      this.setState({
        message: first,
        messages: this.state.messages.slice(1),
      })

      const uuid = JSON.parse(first.body).uuid
      this.setState({ uuid })

      axios.get(`${process.env.REACT_APP_BACKEND_URL}/frames/${uuid}`)
        .then(res => {
          this.setState({
            frames: res.data.frames,
            time_to_expire: this.state.entity_idle,
          })
          this.scheduleExpire(this.state.entity_idle)
        })
    }
  }

  scheduleExpire = (seconds) => {
    if (seconds !== null && seconds !== undefined) {
      this.setState({
        timeout: setTimeout(() => {
          this.setState({ expire: true })
        }, 1000 * seconds)
      })
    }
  }

  render() {

    const { classes } = this.props
    const { value } = this.state

    if (this.state.expire) {
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
              <ArrowBack onClick={() => {
                this.setState({expire: true})
                return <Redirect to={`/entities/${this.props.match.params.entity}/queues`} query="" />
              }} />
            </Link>
          </IconButton>
          <div className={classes.queueTitle}>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {decodeURIComponent(this.props.match.params.group)}
            </Typography>
            <ArrowRight className={classes.arrowDivider} />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {decodeURIComponent(this.props.match.params.queue)}
            </Typography>
          </div>


        </MainBar>

        { /* Meanwhile we need to keep these 2 calls, don't use ternary neither coalesce here */ }
        { this.state.time_to_expire  ? <TimeoutBar seconds={this.state.time_to_expire} /> : null }
        { !this.state.time_to_expire ? <TimeoutBar seconds={0} /> : null }

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
                        uuid: this.state.uuid,
                      }}
                      components={All}
                      jsx={
                        Helpers
                          .htmlize(components)
                          .replace(/(With(Fetcher|Action))/g, '$1 uuid={uuid}')
                      }
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
            : null) }

        </div>

        <div className={classes.actionBar}>

          <NativeSelect
            className={classes.moveToQueue}
            // onChange={(event) => { this.setState({ selectedMoveToQueue: event.target.value })}}
            input={<OutlinedInput labelWidth={0} />}
            name="moveToQueue"
            // value={this.state.selectedMoveToQueue}
          >

            <option hidden >&nbsp;&nbsp;&nbsp;&nbsp;Move to Queue...</option>

            {
              Object.entries(this.state.moving_queues).map(([group, virtual]) =>
                Object.entries(virtual).map(([vname, queues], _) => !queues ? null :
                  [
                    <option key={_} disabled>{group} - {vname}</option>,
                    Object.keys(queues || {}).map((queue, _) =>
                      <option key={_} value={queue}>
                        &nbsp;&nbsp;&nbsp;&nbsp;{queue}
                      </option>
                    ),
                    <option key={`_${_}`} disabled></option>
                  ]
                )).flat()
            }

          </NativeSelect>

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
