var Todo = React.createClass({
  mixins: [Sortable],
  toggleStatus: function(e) {
    this.props.onSetStatus(this.props.todo.id, !this.props.todo.completed);
    this.props.todo.completed = !this.props.todo.completed;
  },
  extraClassName: function() {
    return (this.props.todo.completed ? 'todo--completed' : '');
  },
  render: function() {
    return (
      <article {...this.props} className={"todo " + this.extraClassName()}>
        <input
          type="checkbox"
          onChange={this.toggleStatus}
          value="1"
          checked={this.props.todo.completed}
          className="todo__checkbox" />
        {this.props.todo.title}
        <span className="todo__reorder"></span>
      </article>
      );
  }
});
