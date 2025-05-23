from flask import Flask
import baseball

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Search for a guy!</p>"

@app.route("/<player>")
def lookup(player):
    return baseball.lookup_a_guy(player)

if __name__ == '__app__':
    app.run(debug=True)