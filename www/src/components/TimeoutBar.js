import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
  linearColorPrimary: {
    backgroundColor: blue[800],
  },
  linearBarColorPrimary: {
    backgroundColor: blue[200],
  },
});


class TimeoutBar extends Component {

  state = {
    completed: 0
  }

  progress = () => {
    if (this.state.completed === 100) {
      clearInterval(this.timer)
    }
    else {
      this.setState({ completed: (0.085/parseInt(this.props.minutes)) + this.state.completed });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 50);
  }

  render() {

    const { classes } = this.props;

    return (
        <LinearProgress
            variant="determinate"
            style={{transform: 'rotateY(180deg)'}}
            classes={{
                colorPrimary: classes.linearColorPrimary,
                barColorPrimary: classes.linearBarColorPrimary,
            }}
            value={this.state.completed}
        />
    )
  }

}


TimeoutBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimeoutBar)
