var TodoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    // get todo text
    var title = React.findDOMNode(this.refs.todo).value.trim();

    if (!title) {
      return;
    }
    // save input
    this.props.onTodoSubmit({title: title});
    // empty input
    React.findDOMNode(this.refs.todo).value = '';
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          placeholder="What needs to be done?"
          ref="todo"
          autoFocus="true"
          type="text" />
        <button>Add Todo</button>
      </form>);
  }
});
