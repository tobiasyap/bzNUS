import React from 'react';
import PropTypes from "prop-types";

import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class StartEndPicker extends React.Component {

  static propTypes = {
    start_date: PropTypes.object,
    end_date: PropTypes.object,
    onStartUpdate: PropTypes.func.isRequired,
    onEndUpdate: PropTypes.func.isRequired
  };

  render() {
    const { start_date, end_date, onStartUpdate, onEndUpdate } = this.props;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <Grid item xs={12} sm={5}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="start-date-picker"
              label="Start date"
              value={start_date}
              onChange={date => onStartUpdate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <KeyboardTimePicker
              variant="inline"
              margin="normal"
              id="start-time-picker"
              label="Start time"
              value={start_date}
              onChange={date => onStartUpdate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="end-date-picker"
              label="End date"
              value={end_date}
              onChange={date => onEndUpdate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <KeyboardTimePicker
              variant="inline"
              margin="normal"
              id="end-time-picker"
              label="End time"
              value={end_date}
              onChange={date => onEndUpdate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    )
  }
}

export default StartEndPicker;
