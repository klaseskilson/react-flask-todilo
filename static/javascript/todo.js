var Todo = React.createClass({
  toggleStatus: function(e) {
    this.props.onSetStatus(this.props.id, !this.props.completed);
    this.props.completed = !this.props.completed;
  },
  render: function() {
    return (
      <article>
        <input type="checkbox" onChange={this.toggleStatus} value="1"
          checked={this.props.completed} />
        {this.props.title}
      </article>
      );
  }
});
var TodoList = React.createClass({
  render: function() {
    var list = this;
    document.title = 'Todo (' + (this.props.data.length) + ')';
    var todoNodes = this.props.data.map(function(todo) {
      return (<Todo title={todo.title} id={todo.id} below={todo.below}
        completed={todo.completed} key={todo.id}
        onSetStatus={list.props.onSetStatus} />);
    });
    return <div>{todoNodes}</div>;
  }
});
var TodoForm = React.createClass({
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = React.findDOMNode(this.refs.todo).value.trim();

    if (!title) {
      return;
    }

    this.props.onTodoSubmit({title: title});

    React.findDOMNode(this.refs.todo).value = '';
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input placeholder="Todo..." ref="todo" autoFocus="true" />
        <button>Add</button>
      </form>);
  }
});
var TodoApp = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  fetchTodos: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data.todos});
      }.bind(this),
      error: function(xhr, status, error) {
        console.log('An error ('+status+') occured:', error.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.fetchTodos();
  },
  saveTodo: function(todo) {
    // quick! append added todo to list of todos
    var todos = this.state.data;
    var newTodos = todos.concat([todo]);
    this.setState({data: newTodos});

    // save todo in db
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function(data) {
        // update list of todos from fresh db
        this.setState({data: data.todos});
      }.bind(this),
      error: function(xhr, status, error) {
        console.log('An error ('+status+') occured:', error.toString());
      }.bind(this)
    });
  },
  setStatus: function(id, status) {
    // update todo in db
    $.ajax({
      url: '/todos/'+id+'/status.json',
      dataType: 'json',
      type: 'POST',
      data: {completed: status},
      success: function(data) {
        // update list of todos from fresh db
        this.setState({data: data.todos});
      }.bind(this),
      error: function(xhr, status, error) {
        console.log('An error ('+status+') occured:', error.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <TodoForm onTodoSubmit={this.saveTodo} />
        <TodoList data={this.state.data} onSetStatus={this.setStatus} />
      </div>
    );
  }
});

React.render(
  <TodoApp url="todos.json" />,
  document.getElementById('app')
);
