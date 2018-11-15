import json
import os
import random
from flask import Flask, request, Response, jsonify, send_from_directory
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "Hello World!"

@app.route("/images/experiment/<id>")
def get_images(id):
    num_imgs = int(request.args.get('n', 10))
    res = []
    for (dir, is_real) in EXPTS[id]:
        path = os.path.join(os.path.dirname(__file__), 'static', dir)
        images = os.listdir(path)
        random.shuffle(images)
        res += [[os.path.join(dir, img), is_real] for img in images[:num_imgs // 2]]
    random.shuffle(res)
    return json.dumps(res)

@app.route('/images/<dir>/<filename>')
def get_image(dir, filename):
    return send_from_directory(os.path.join('static', dir), filename)

EXPTS = {
    '1': [('gan', 0), ('real', 1)],
    '2': [('gan-blur', 0), ('real-blur', 1)]
}