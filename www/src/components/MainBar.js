import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


const styles = {
  root: {
    flexGrow: 1,
  },

};


class MainBar extends Component {

  render() {

    const { classes } = this.props;

    return (
        <div className={classes.root}>
          <AppBar position="static" color="primary">
            <Toolbar variant="dense">
              {this.props.children}
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

MainBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainBar);