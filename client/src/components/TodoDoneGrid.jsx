import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import moment from "moment";

const styles = theme => ({
  root: {
    flexGrow: 1
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

class TodoDoneGrid extends React.Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired
  };

  render() {
    const { classes } = this.props;

    const gridItems = this.props.todos.map(todo => {
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
}

export default withStyles(styles)(TodoDoneGrid);
