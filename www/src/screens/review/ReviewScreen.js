import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

import Helpers from './helpers'
import axios from 'axios'
import webstomp from 'webstomp-client'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'

import IconButton from '@material-ui/core/IconButton'
import ArrowBack from '@material-ui/icons/ArrowBack'
import ArrowRight from '@material-ui/icons/ArrowRight'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Inbox from '@material-ui/icons/Inbox'
import WebAsset from '@material-ui/icons/WebAsset'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Mail from '@material-ui/icons/Mail'
import ShutterSpeed from '@material-ui/icons/ShutterSpeed'
import SwapHoriz from '@material-ui/icons/SwapHoriz'
import NotificationsActive from '@material-ui/icons/NotificationsActive'
import BlurOn from '@material-ui/icons/BlurOn'
import Layers from '@material-ui/icons/Layers'

import MainBar from '../../components/MainBar'
import TimeoutBar from '../../components/TimeoutBar'

import Button from '@material-ui/core/Button'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import NoSsr from '@material-ui/core/NoSsr'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import JsxParser from 'react-jsx-parser'
import All from '../../components/spotframe/All'


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#f6f6f6',
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

  padding: {
    paddingLeft: 10,
  },

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

  actionBar: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  nextMessageButton: {
    margin: theme.spacing.unit,
    backgroundColor: 'black',
    color: 'powderblue',
    '&:hover': {
      color: 'mediumspringgreen',
      backgroundColor: 'black',
    },
  },

  moveToQueue: {
    width: 250,
    margin: 8,
    position: 'relative',
    fontSize: '0.875rem',
    fontFamily: "Roboto",
    fontWeight: 500,
    color: 'powderblue',
    letterSpacing: '0.02857em',
    borderRadius: theme.shape.borderRadius,
    borderBottom: 0,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover:enabled': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
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
    <Typography component="div" style={{ padding: 0 }}>
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
    customStates: {},
    fetchers: {},
    backends: {},
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
    queue_to_move: '',
    queue_dialog: false,
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

                  this.getFramesByUUID(uuid)

                  this.setState({ time_to_expire: this.state.entity_idle })
                  this.scheduleExpire(this.state.entity_idle)

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

  getFramesByUUID = uuid => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/frames/${uuid}`)
      .then(res => {

        Object.entries(res.data.frames).forEach(([frame, components], index) => {

          Array.from(
              new Set(
                Helpers.htmlize(components)
                  .match(/(Fetcher|Backend)="[^"]+"/g)
                  .map(element => element.split('='))
                  .map(([type, name]) => [
                    type.toLowerCase().concat('s'),
                    name.replace(/"/g, '')
                  ])
              )
            ).forEach(([type, name]) => {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/${type}/${name}${( type === 'fetchers' ? `/${uuid}` : '')}`)
              .then(res => this.setState({ [type]: {...this.state[type], [name]: res.data} }))
            })

        })

        this.setState({ frames: res.data.frames })

    })
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

  ackMessage = (message, messages, move_to_queue = null) => {

    if (move_to_queue && this.state.broker) {
      this.state.broker.send(
        `/queue/${move_to_queue}`,
        message.body,
        {
          priority: 1,
          persistent: true,
          ...JSON.parse(message.body)
        }
      )
    }

    message.ack()

    this.setState({
      message: null,
      frames: {},
      uuid: null,
      time_to_expire: 0,
      queue_to_move: null,
      customStates: {},
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

      this.getFramesByUUID(uuid)

      this.setState({ time_to_expire: this.state.entity_idle })
      this.scheduleExpire(this.state.entity_idle)

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

  handleClickOpen = () => {
    this.setState({ queue_dialog: true })
  }

  handleClickClose = () => {
    this.setState({ queue_dialog: false })
  }

  render() {

    const { classes } = this.props
    const { value } = this.state

    let { entity, group, queue } = this.props.match.params

    if (this.state.expire) {
      return <Redirect to={`/entities/${this.props.match.params.entity}/queues`} query="" />
    }

    return (

      <NoSsr>

        <MainBar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <Link
              to={`/entities/${entity}/queues`}
              query=""
              style={{textDecoration: 'none', color: 'white', height: 24}}
            >
              <ArrowBack onClick={() => {
                this.setState({expire: true})
                return <Redirect to={`/entities/${entity}/queues`} query="" />
              }} />
            </Link>
          </IconButton>
          <div className={classes.queueTitle}>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {decodeURIComponent(group)}
            </Typography>
            <ArrowRight className={classes.arrowDivider} />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {decodeURIComponent(queue)}
            </Typography>
          </div>


          <div className={classes.actionBar}>

            <Select
              disableUnderline
              disabled={!this.state.uuid}
              className={classes.moveToQueue}
              onChange={(e) => {
                this.setState({
                  queue_to_move: e.target.value,
                })
                this.handleClickOpen()
              }}
              name="moveToQueue"
              renderValue={value =>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <SwapHoriz className={classes.padding} />
                  <span style={{paddingLeft: 7}}>{value}</span>
                </div>
              }
              value={this.state.queue_to_move || 'MOVE TO QUEUE'}
            >

              {
                Object.entries(this.state.moving_queues).map(([group, virtual]) =>
                  Object.entries(virtual).map(([vname, queues], _) => !queues ? null :
                    [
                      <MenuItem key={_} disabled>
                        <BlurOn />
                        <div
                          className={classes.padding}
                          style={{display: 'flex', alignItems: 'center'}}
                        >
                          {group}
                          <ArrowRight style={{fontSize: 18, color: '#bbb'}} />
                          {vname}
                        </div>
                      </MenuItem>,
                      Object.keys(queues || {}).map((queue, __) =>
                        <MenuItem key={__} value={queue}>
                          <Layers style={{paddingLeft: 32}} />
                          <span className={classes.padding}>{queue}</span>
                        </MenuItem>
                      ),
                    ]
                  )).flat()
              }

            </Select>

            <Dialog
              open={this.state.queue_dialog}
              onClose={this.handleClickClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{`Move to Queue`}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Move this {entity} to the <b>{this.state.queue_to_move}</b> queue?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClickClose} color="primary">
                  No
                </Button>
                <Button
                  onClick={() => {
                    this.ackMessage(
                      this.state.message,
                      this.state.messages,
                      this.state.queue_to_move
                    )
                    this.handleClickClose()
                  }}
                  color="primary"
                  autoFocus
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="contained"
              disabled={this.state.message === null}
              className={classes.nextMessageButton}
              onClick={() => this.ackMessage(this.state.message, this.state.messages)}
            >
              Next {Helpers.titleize(this.props.match.params.entity)} <ChevronRight />
            </Button>

          </div>

          <div>
            <IconButton disabled color="inherit" aria-label="Menu">
                <ShutterSpeed />
            </IconButton>

            <IconButton disabled color="inherit" aria-label="Menu">
                <NotificationsActive />
            </IconButton>

            <IconButton disabled color="inherit" aria-label="Menu">
                <AccountCircle />
            </IconButton>
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
                label={
                  <div style={{display: 'flex'}}>
                    <WebAsset />
                    <span style={{marginLeft: 10, fontSize: '0.8650rem'}}>{Helpers.titleize(frame)}</span>
                  </div>
                }
              />
            )
          }

          </Tabs>

          {

            Object.entries(this.state.frames).map(([frame, components], index) => {

              var jsx = Helpers.htmlize(components)
                          .replace(/(WithAction)/g, '$1 uuid={uuid} customStates={customStates}')
                          .replace(/(WithFetcher)/g, '$1 Fetchers={fetchers}')
                          .replace(/(WithBackend.*?Backend="([^"]+)")/g, '$1 Value={customStates} Backends={backends} changeBackend={changeBackend}')

              return (
                value === index &&
                <TabContainer key={index} id={`cont${index}`}>
                  <JsxParser
                      bindings={{
                        uuid: this.state.uuid,
                        fetchers: this.state.fetchers,
                        backends: this.state.backends,
                        customStates: this.state.customStates,
                        changeBackend: (backend, value) =>
                          this.setState({
                            customStates: {...this.state.customStates, [backend]: value}
                          })
                      }}
                      components={All}
                      jsx={jsx}
                    />
                </TabContainer>
              )
            }
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

      </NoSsr>
    )

  }
}

ReviewScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReviewScreen)
