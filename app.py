# import our packages
import sqlite3
from flask import Flask, request, g, render_template, jsonify, flash
from contextlib import closing

# setup app with config
app = Flask(__name__)
app.config.from_object('config')

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

# call this function to install our db
def init_db():
    # load the db cursor
    with closing(connect_db()) as db:
        # open schema and prepare its commands
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        # execute the prepared commands
        db.commit()

@app.before_request
def before_request():
    g.db = connect_db()

# called after response is constructed
@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.route('/')
def show_home():
    return render_template('home.html')

@app.route('/todos.json')
def show_todos():
    # get cursor of results
    cur = g.db.execute('select id, title, completed, below from todos order \
                        by below asc')
    # fetch the entries
    todos = cur.fetchall()
    json_results = []
    # iterate over todos
    for todo in todos:
        t = {'id': todo[0],
             'title': todo[1],
             'completed': todo[2],
             'below': todo[3]}
        json_results.append(t)
    # respond with json
    return jsonify(todos = json_results)

@app.route('/add.json', methods = ['POST'])
def add_todo():
    # try to save
    try:
        g.db.execute('insert into todos (title, below) values (?, ?)',
            [request.form['title'], request.form['below']])
        g.db.commit()
        # prep response
        resp = jsonify(message = 'created todo')
        return resp
    except Exception as e:
        return jsonify({"response": "ERROR %s" % str(e)})

@app.route('/<int:todo_id>/status.json', methods = ['POST'])
def set_status(todo_id):
    try:
        g.db.execute('update todos set completed = ? where id = ?',
            [request.form['completed'], todo_id])
        g.db.commit()
        resp = jsonify(message = 'updated todo',
                       id = todo_id,
                       completed = request.form['completed'])
        return resp
    except Exception as e:
        return jsonify({"response": "ERROR %s" % str(e)})

@app.route('/<int:todo_id>/order.json', methods = ['POST'])
def set_order(todo_id):
    try:
        g.db.execute('update todos set below = ? where id = ?',
            [request.form['below'], todo_id])
        g.db.commit()
        resp = jsonify(message = 'updated todo',
                       id = todo_id,
                       below = request.form['below'])
        return resp
    except Exception as e:
        return jsonify({"response": "ERROR %s" % str(e)})

if __name__ == '__main__':
    app.run()
