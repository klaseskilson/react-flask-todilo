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
  getInitialState: function() {
    return {text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input onChange={this.onChange} value={this.state.text} />
        <button>Add</button>
      </form>);
  }
});
var TodoApp = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  render: function() {
    return (
      <div>
        <TodoForm />
        <TodoList data={this.props.data} />
      </div>
    );
  }
});

React.render(
  <TodoApp data={data} />,
  document.getElementById('app')
);
