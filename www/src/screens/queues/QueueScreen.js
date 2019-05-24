import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import axios from 'axios'

import Badge from '@material-ui/core/Badge'

import MainBar from '../../components/MainBar'
import IconButton from '@material-ui/core/IconButton'

import ArrowBack from '@material-ui/icons/ArrowBack'
import Person from '@material-ui/icons/Person'
import BlurOn from '@material-ui/icons/BlurOn'


import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'




const styles = theme => ({
  table: {
    minWidth: 700,
  },
  badge: {
    top: '50%',
    right: -3,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
    }`,
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  chip: {
    margin: theme.spacing.unit,
  },

  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  person: {
    marginLeft: 30,
    color: '#999'
  }
});


const StyledBadge = withStyles(theme => ({
  badge: {
    top: '50%',
    right: -3,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
    }`,
  },
}))(Badge);



class QueueScreen extends Component {

  state = {
    queues: [],
    expanded: null,
    interval: null,
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  getQueues = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/queues/${this.props.match.params.entity}`)
      .then(res => { this.setState({ queues: res.data || [] }) })
  }

  componentDidMount() {
    this.getQueues()
    this.setState({ interval: setInterval(this.getQueues, 5000) })
  }

  render() {

    const { classes } = this.props
    const { expanded } = this.state

    return (
      <div>

        <MainBar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <Link
              to="/entities"
              query=""
              style={{textDecoration: 'none', color: 'white', height: 24}}
            >
              <ArrowBack />
            </Link>
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Queues
          </Typography>

        </MainBar>

        {
          Object.entries(this.state.queues).map(([group, aliases], _) =>
            <div key={_} style={{margin: 20}}>

                <legend><b>{group}</b></legend>
                <br/>
                <div className={classes.root}>
                {
                  Object.entries(aliases).map(([virtual, queues], _) =>

                      <ExpansionPanel key={_} expanded={expanded === virtual} onChange={this.handleChange(virtual)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography className={classes.heading}>

                            <StyledBadge
                              badgeContent={Object.entries(queues || {}).map(([_, props]) => (props ? props.messages_ready : 0)).reduce((p, n) => p + n, 0)}
                              max={999999}
                              color="secondary"
                              classes={{ badge: classes.badge }}
                            >
                              <BlurOn />
                            </StyledBadge>


                            <StyledBadge
                              badgeContent={Object.entries(queues || {}).map(([_, props]) => (props ? props.consumers : 0)).reduce((p, n) => p + n, 0)}
                              color="primary"
                              className={classes.person}
                            >
                              <Person />
                            </StyledBadge>


                            <span style={{marginLeft: 70, color: '#bbb'}}>
                                {(queues ?
                                  <b>
                                    <Link
                                      query=""
                                      to={`/entities/${this.props.match.params.entity}/queues/${encodeURIComponent(group)}/${encodeURIComponent(virtual)}`}
                                      style={{textDecoration: 'none'}}
                                    >
                                      {virtual}
                                    </Link>
                                  </b>
                                  : virtual)}
                            </span>

                          </Typography>
                          <Typography className={classes.secondaryHeading}>
                            {Object.entries(queues || {}).map(([queue, _]) => queue).join(' + ')}
                          </Typography>

                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Typography>
                          </Typography>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>

                  )
                }
                </div>


              <br />
            </div>
          )
        }
      </div>
    )
  }
}

QueueScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueueScreen)
