import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import red from '@material-ui/core/colors/red'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'
import BubbleChart from '@material-ui/icons/BubbleChart'
import Avatar from '@material-ui/core/Avatar'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'

import Typography from '@material-ui/core/Typography'

import MainBar from '../../components/MainBar'



const styles = theme => ({
  entity_screen: {
    display: 'flow-root',
    marginLeft: 100,
    marginRight: 100,
    marginTop: 75,
    marginBottom: 75,
  },
  card: {
    maxWidth: 400,
    margin: 20
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },

  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    cursor: 'initial',
    "&:hover": {
      backgroundColor: "transparent"
    }
  },

});


class EntityScreen extends Component {

  state = {
    expanded: false,
    entities: [],
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  };

  componentDidMount() {
    console.log(process.env.REACT_APP_BACKEND_URL)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/entities`)
      .then(res => { this.setState({ entities: res.data }) })
  }


  render() {

    const { classes } = this.props

    return (
      <div>

        <MainBar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" disableRipple>
              <BubbleChart />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Entities
          </Typography>

        </MainBar>

        <div className={classes.entity_screen}>

          {
            Object.entries(this.state.entities).map(([entity, properties], _) =>
              <Link key={_} to={`/entities/${entity}/queues`} style={{textDecoration: 'none'}}>
                <Card className={classes.card}>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="Recipe" className={classes.avatar}>
                        {entity.match(/((?:^)|(?<=[.-_]))\w/g).join('').toUpperCase()}
                      </Avatar>
                    }
                    action={
                      <IconButton disabled>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={properties.name}
                    subheader={entity}
                  />

                  <CardContent>
                    <Typography component="p">
                      {properties.desc}
                    </Typography>
                  </CardContent>

                </Card>
              </Link>
            )
          }

        </div>

      </div>
    )
  }
}

EntityScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EntityScreen)