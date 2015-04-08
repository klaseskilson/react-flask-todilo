var data = [
  {
    "below": 0,
    "completed": 0,
    "id": 2,
    "title": "todo1"
  },
  {
    "below": 0,
    "completed": 0,
    "id": 3,
    "title": "asdasda a asd asd as da"
  },
  {
    "below": 1,
    "completed": 0,
    "id": 4,
    "title": "hahaha"
  },
  {
    "below": 1,
    "completed": 0,
    "id": 5,
    "title": "alla senaste"
  },
  {
    "below": 1,
    "completed": 0,
    "id": 6,
    "title": "allra senaste"
  },
  {
    "below": 1,
    "completed": 0,
    "id": 7,
    "title": "allra senaste"
  },
  {
    "below": 2,
    "completed": 3,
    "id": 1,
    "title": "todo"
  }
];
var Todo = React.createClass({
  render: function() {
    return (
      <article>
        <input type="checkbox" value="1" checked={this.props.completed} />
        {this.props.title}
      </article>
      );
  }
});
var TodoList = React.createClass({
  render: function() {
    // var createItem = function(itemText, index) {
    //   return <article key={index + itemText}>{itemText}</article>;
    // };
    // return <div>{this.props.items.map(createItem)}</div>;
    document.title = 'Todo (' + (this.props.data.length) + ')';
    var todoNodes = this.props.data.map(function(todo) {
      return (<Todo title={todo.title} id={todo.id} below={todo.below}
        completed={todo.completed} key={todo.id} />);
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
        <input placeholder="Todo..." ref="todo" />
        <button>Add</button>
      </form>);
  }
});
var TodoApp = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
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
  render: function() {
    return (
      <div>
        <TodoForm onTodoSubmit={this.saveTodo} />
        <TodoList data={this.state.data} />
      </div>
    );
  }
});

React.render(
  <TodoApp url="todos.json" />,
  document.getElementById('app')
);
