import json
import os
from flask import Flask, request, Response, jsonify, send_from_directory
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "Hello World!"

@app.route("/images")
def get_image_urls():
    path = os.path.join(os.path.dirname(__file__), 'static/images')
    return json.dumps(os.listdir(path))

@app.route('/images/<path:filename>')
def get_image(filename):
    return send_from_directory('static/images', filename, as_attachment=True)
