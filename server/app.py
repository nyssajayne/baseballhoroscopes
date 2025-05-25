from flask import Flask
from markupsafe import escape
from flask_cors import CORS
import baseball

app = Flask(__name__)
CORS(app, origins='*')

@app.route("/")
def hello_world():
    return "<p>Search for a guy!</p>"

@app.route("/<player>")
def lookup(player):
    return baseball.lookup_a_guy(escape(player))

if __name__ == '__app__':
    app.run(debug=True)