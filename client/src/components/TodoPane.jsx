import React from "react";
import PropTypes from "prop-types";
import { Row, Button } from "reactstrap";

import TodoGrid from "./TodoGrid";
import TodoDoneGrid from "./TodoDoneGrid";
import TodoCreationModal from "./TodoCreationModal";

class TodoPane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTodoCreationModal: false
    };
  }
  static propTypes = {
    group_id: PropTypes.number.isRequired,
    todos: PropTypes.array.isRequired,
    onTodoUpdate: PropTypes.func
  };

  render() {
    const undoneTodos = this.props.todos.filter(todo => !todo.is_done);
    const doneTodos = this.props.todos.filter(todo => todo.is_done);
    return (
      <div>
        <Row>
          <Button color="primary" onClick={this.onTodoCreationButtonClick}>
            Create
          </Button>
        </Row>
        <h5>Undone</h5>
        <TodoGrid todos={undoneTodos} onUpdate={this.props.onTodoUpdate} />
        <h5>Done</h5>
        <TodoDoneGrid todos={doneTodos} />
        <TodoCreationModal
          group_id={this.props.group_id}
          isOpen={this.state.showTodoCreationModal}
          onToggle={this.onTodoCreationToggle}
          onCreate={this.props.onTodoUpdate}
        />
      </div>
    );
  }

  onTodoCreationButtonClick = () => {
    this.setState({ showTodoCreationModal: true });
  };

  onTodoCreationToggle = () => {
    const { showTodoCreationModal } = this.state;
    this.setState({ showTodoCreationModal: !showTodoCreationModal });
  };
}

export default TodoPane;
