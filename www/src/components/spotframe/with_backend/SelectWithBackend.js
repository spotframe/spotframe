import React, { Component } from 'react'

import axios from 'axios'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';


const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
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
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const styles = theme => ({
  root: {
    display: 'inline-flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
});

class SelectWithBackend extends Component {

  signal = axios.CancelToken.source()

  state = {
    value: '',
    values: {}
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  componentDidMount() {
      axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/backends/${this.props.Backend}`,
        { cancelToken: this.signal.token })
        .then(res => { this.setState({ values: res.data }) })
        .catch(err => {})
  }

  componentWillUnmount() {
    this.signal.cancel()
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.margin}>
          <InputLabel htmlFor="age-customized-native-simple" className={classes.bootstrapFormLabel}>
            {this.props.Backend}
          </InputLabel>
          <NativeSelect
            value={this.state.value}
            onChange={this.handleChange}
            input={<BootstrapInput name={this.props.Backend} id="" />}
          >
                { Object.entries(this.state.values).map(([key, value], index) =>
                  <option key={index} value={key}>{value}</option> )}
          </NativeSelect>
        </FormControl>
      </form>
    );
  }
}

SelectWithBackend.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectWithBackend);