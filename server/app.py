import json
import os
import random
from flask import Flask, request, Response, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database-12-22-18.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Experiment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(16), nullable=False)
    expt_id = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    true = db.Column(db.Boolean, nullable=False)
    pred = db.Column(db.Boolean, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(80), nullable=False)
    expert = db.Column(db.Boolean, nullable=False)
    filename = db.Column(db.String(120), nullable=False)


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

@app.route("/images/experiment/<id>/repr")
def get_repr_images(id):
    res = []
    for (dir, is_real) in EXPTS[id]:
        path = os.path.join(os.path.dirname(__file__), 'static', '%s-repr' % dir)
        images = os.listdir(path)
        res += [os.path.join('%s-repr' % dir, img) for img in images]
    return json.dumps(res)

@app.route('/images/<dir>/<filename>')
def get_image(dir, filename):
    cache_timeout = None
    if dir == 'plots':
        cache_timeout = -1
    return send_from_directory(os.path.join('static', dir), filename, cache_timeout=cache_timeout)

@app.route('/experiment/<id>', methods=['POST'])
def post_results(id):
    data = request.json
    # print (data)
    for (res, img) in zip(data['results'], data['images']):
        expt = Experiment(
            expt_id = int(id),
            duration = data['duration'],
            true = img[1],
            pred = res,
            uid = data['uid'],
            age = int(data['age']),
            gender = data['gender'],
            expert = (data['expert'] == "true"),
            filename = img[0]
        )
        db.session.add(expt)
    db.session.commit()
    # print("Success")
    return "Success"

EXPTS = {
    '1': [('real', 1), ('gan', 0)],
    '2': [('real-blur', 1), ('gan-blur', 0)]
}