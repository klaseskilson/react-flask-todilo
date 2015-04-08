# import our packages
import sqlite3
from flask import Flask
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

if __name__ == '__main__':
    app.run()
