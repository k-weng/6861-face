#!/usr/bin/env bash
pip install -r requirements.txt
gunicorn -w 4 -b 127.0.0.1:5000 app:app
