from app import app
from markupsafe import escape
from flask_cors import CORS
from app import baseball

# app = Flask(__name__)
CORS(app, origins='*')

@app.route('/')
@app.route('/index')
def index():
    return "Play Ball!"

@app.route("/<player>")
def lookup(player):
    return baseball.lookup_a_guy(escape(player))