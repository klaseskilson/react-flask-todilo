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
        <input type="checkbox" onChange={this.toggleStatus} value="1"
          checked={this.props.todo.completed} className="todo__checkbox" />
        {this.props.todo.title}
        <span className="todo__reorder">r</span>
      </article>
      );
  }
});
var TodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.items.map(function(todo, index) {
      return (
        <Todo
          todo={todo}
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
var TodoForm = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    // get todo text
    var title = this.state.text;
    if (!title) {
      return;
    }
    // save input
    this.props.onTodoSubmit({title: title});
    // empty input
    this.setState({text: ''});
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          placeholder="What needs to be done?"
          ref="todo"
          autoFocus="true"
          onChange={this.onChange}
          value={this.state.text}
          type="text" />
        <button>Add Todo</button>
      </form>);
  }
});
var TodoApp = React.createClass({
  getInitialState: function() {
    return {data: {items: []}};
  },
  fetchTodos: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
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
    var todos = this.state.data.items;
    var newTodos = todos.concat([todo]);
    this.setState({data: {todos: newTodos}});

    // save todo in db
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function(data) {
        // update list of todos from fresh db
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, error) {
        console.log('An error ('+status+') occured:', error.toString());
      }.bind(this)
    });
  },
  sort: function(items, dragging) {
    var data = this.state.data;
    data.items = items;
    data.dragging = dragging;
    this.setState({data: data});
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
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, error) {
        console.log('An error ('+status+') occured:', error.toString());
      }.bind(this)
    });
  },
  notDoneFilter: function(todo) {
    return !todo.completed;
  },
  clearAll: function() {
    // it was either making ugly ajax call (I hate how this code looks)
    // or making one call for every todo entry
    $.ajax({
      url: '/todos/complete_all.json',
      dataType: 'json',
      type: 'POST',
      success: function(data) {
        // update list of todos from fresh db
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, error) {
        console.log('An error ('+status+') occured:', error.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <header className="todoheader">
          <h1>Todos</h1>
        </header>
        <TodoForm onTodoSubmit={this.saveTodo} />
        <TodoList
          data={this.state.data}
          onSetStatus={this.setStatus}
          sort={this.sort} />
        <footer className="todofooter">
          <span className="todofooter__counter">
            {this.state.data.items.filter(this.notDoneFilter).length} items left
          </span>
          <a href="#" onClick={this.clearAll} className="todofooter__completeall">
            Mark all as complete
          </a>
        </footer>
      </div>
    );
  }
});

React.render(
  <TodoApp url="todos.json" />,
  document.getElementById('app')
);
