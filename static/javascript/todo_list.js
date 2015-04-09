var TodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.items.map(function(todo, index) {
      return (
        <Todo
          todo={todo}
          key={todo.id}
          reactKey={index}
          data-id={index}
          onSetStatus={this.props.onSetStatus}
          sort={this.props.sort}
          data={this.props.data} />
      );
    }, this);
    return <div className="todolist">{todoNodes}</div>;
  }
});
