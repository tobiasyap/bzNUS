import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import moment from "moment";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  button: {
    margin: theme.spacing(1)
  },
  card: {
    minWidth: 275
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

class TodoGrid extends React.Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    classes: PropTypes.object.isRequired
  };

  onDoneClick = (todo_id) => {
    fetch(`/api/todos/${todo_id}/isdone`, {
      method: "PUT",
      credentials: "include",
      headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        is_done: true
      })
    })
    .then(res => {
      if(res.status === 200) {
        this.props.onUpdate();
        return;
      }
      throw Error("Failed to update Todo as done");
    })
    .catch(err => {
      console.error(err);
      alert("Unexpected error. Please try again.");
    })
  };

  render() {
    const { classes } = this.props;

    let gridItems = [];
    for (const todo of this.props.todos) {
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
    gridItems = this.props.todos.map(todo => {
      return (
        <Grid item xs={3} key={`gi_${todo.todo_id}`}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {todo.title}
              </Typography>
              <Typography className={classes.pos} variant="body1" component="p">
                {todo.description}
              </Typography>
              <Typography variant="caption" color="textSecondary" textAlign="bottom">
                {moment(todo.created_at).format("ddd, DD/MM/YY h:mma")}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => this.onDoneClick(todo.todo_id)}>Mark as Done</Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          {gridItems}
        </Grid>
      </div>
    );
  }
};

export default withStyles(styles)(TodoGrid);
