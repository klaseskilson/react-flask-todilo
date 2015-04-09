# import our packages
import sqlite3, json
from flask import Flask, request, g, render_template, jsonify, flash, redirect, \
url_for
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

"""
    Database helpers
"""
# set g.db
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect_db()
    return db

# when context is closed, close connection to db
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# neat helper for simplified queries
def query_db(query, args = (), commit = False, one=False):
    cur = get_db().execute(query, args)
    if commit:
        get_db().commit()
        return None
    else:
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv

"""
    Routes
"""

@app.route('/')
def show_app():
    return render_template('app.html')

@app.route('/todos.json', methods = ['GET'])
def show_todos():
    # use query_db helper to fetch todos
    todos = query_db('select id, title, completed, ordered from todos order by \
                      ordered asc')
    json_results = []
    # iterate over todos
    for todo in todos:
        t = {'id': todo[0],
             'title': todo[1],
             'completed': todo[2],
             'ordered': todo[3]}
        json_results.append(t)
    # respond with json
    return jsonify(items = json_results)

@app.route('/todos.json', methods = ['POST'])
def create_todo():
    # try to save
    try:
        # get last todo
        last = query_db('select ordered from todos order by ordered desc limit 1', (), False, True)
        last = last[0] if last else None
        # insert new todo below the last one in the list
        query_db('insert into todos (title, ordered) values (?, ?)',
            [request.form['title'], last], True)
        return redirect(url_for('show_todos'))
    except Exception as e:
        return jsonify({"response": "ERROR %s" % str(e)})

@app.route('/todos/complete_all.json', methods = ['POST'])
def complete_all():
    try:
        query_db('update todos set completed=1', (), True)
        return redirect(url_for('show_todos'))
    except Exception as e:
        return jsonify({"response": "ERROR %s" % str(e)})

@app.route('/todos/<int:todo_id>/status.json', methods = ['POST'])
def set_status(todo_id):
    try:
        completed = 1 if request.form['completed'] == 'true' else 0
        query_db('update todos set completed = ? where id = ?',
            [completed, todo_id], True)
        return redirect(url_for('show_todos'))
    except Exception as e:
        return jsonify({"response": "ERROR %s" % str(e)})

@app.route('/todos/set_order.json', methods = ['POST'])
def set_order():
    # convert from json string to python array
    order = json.loads(request.form['order'])
    try:
        # iterate over items in order array
        for todo in order:
            query_db('update todos set ordered = ? where id = ?',
                [todo['order'], todo['id']], True)
        return redirect(url_for('show_todos'))
    except Exception as e:
        return jsonify({"response": "ERROR %s" % str(e)})

"""
    Run the app!
"""

if __name__ == '__main__':
    app.run()
