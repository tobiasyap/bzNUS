import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import moment from 'moment';

const TodoGrid = (props) => {
  const classes = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }))();
  
  let gridItems = [];
  for(const todo of props.todos) {
    gridItems.push(
      <Grid item xs={3} key={`gi_${todo.todo_id}`}>
        <Paper className={classes.paper}>
          <h5>{todo.title}</h5>
          <p>{todo.description}</p>
          <p>{moment(todo.created_at).format("ddd, DD/MM/YY h:mm:ss a")}</p>
        </Paper>
      </Grid>
    );
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {gridItems}
      </Grid>
    </div>
  );
};

export default TodoGrid;
