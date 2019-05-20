import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import axios from 'axios'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
})


class ButtonWithAction extends Component {

  state = {
    once: false,
  }

  onClick() {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/actions/${this.props.Action}/${this.props.uuid}`)
      .then(res => {
        this.setState({ once: this.props.Single || false })
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <Button
        disabled={this.state.once}
        color={this.props.Color || 'primary'}
        variant={this.props.Variant || 'contained'}
        className={classes.button}
        onClick={() => { this.onClick() }}
      >
        {this.props.Text}
      </Button>
    )
    
  }
}

ButtonWithAction.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ButtonWithAction)
