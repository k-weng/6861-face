import json
from flask import Flask, request, Response, jsonify

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"
