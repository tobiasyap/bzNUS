import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const TodoGrid = (props) => {
  const classes = useStyles();
  
  let gridItems = [];
  for(const todo of props.todos) {
    gridItems.push(
      <Grid item xs={6} key={`gi_${todo.todo_id}`}>
        <Paper className={classes.paper}>
          {todo.title}
          {todo.description}
          {todo.created_at}
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
