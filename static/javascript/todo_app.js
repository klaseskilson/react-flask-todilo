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
    this.setState({data: {items: newTodos}});

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
  sort: function(items, dragging) {
    var data = this.state.data;
    data.items = items;
    data.dragging = dragging;
    this.setState({data: data});
    if (this.sendSetOrder) {
      var self = this;
      this.sendSetOrder = false;
      setTimeout(function() {
        self.setOrder();
      }, 3000);
    }
  },
  sendSetOrder: true,
  setOrder: function() {
    // get order
    var ordered = this.state.data.items.map(function(item, index) {
      return {id: item.id, order: index};
    });
    // send request
    $.ajax({
      url: '/todos/set_order.json',
      dataType: 'json',
      type: 'POST',
      data: {order: JSON.stringify(ordered)},
      success: function(data) {
        // update list of todos from fresh db
        this.setState({data: data});
        this.sendSetOrder = true;
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
