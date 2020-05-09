#!/usr/bin/env python3


import os
import json
import shutil
import time

# https://docs.python.org/3/howto/logging.html
import logging

# https://hplgit.github.io/web4sciapps/doc/pub/._web4sa_flask004.html
from flask import Flask, redirect, render_template, request, url_for, flash, jsonify

# https://gist.github.com/lost-theory/4521102
from flask import g
from werkzeug.utils import secure_filename

# removed "Form" from wtforms; see https://stackoverflow.com/a/20577177/1164295
from wtforms import Form, StringField, validators, FieldList, FormField, IntegerField, RadioField, PasswordField, SubmitField, BooleanField  # type: ignore

from config import (
    Config,
)  # https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iii-web-forms

import compute  # PDG

# global proc_timeout
proc_timeout = 30


app = Flask(__name__, static_folder="static")
app.config.from_object(
    Config
)  # https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iii-web-forms
app.config[
    "UPLOAD_FOLDER"
] = "/homeSer/app/uploads"  # https://flask.palletsprojects.com/en/1.1.x/patterns/fileuploads/
app.config[
    "SEND_FILE_MAX_AGE_DEFAULT"
] = 0  # https://stackoverflow.com/questions/34066804/disabling-caching-in-flask
app.config["DEBUG"] = True


if __name__ == "__main__":
    # called from flask
    print("called from flask")

    # https://docs.python.org/3/howto/logging.html
    logging.basicConfig(  # filename='pdg.log',
        filemode="w",
        level=logging.DEBUG,
        format="%(asctime)s|%(filename)-13s|%(levelname)-5s|%(lineno)-4d|%(funcName)-20s|%(message)s",
        datefmt="%m/%d/%Y %I:%M:%S %p",
    )
    logger = logging.getLogger(__name__)



class SearchString(Form):
    logger.info("[trace]")
    text = StringField(
        "text",
        validators=[validators.InputRequired(), validators.Length(max=1000)],
    )


@app.before_request
def before_request():
    g.start = time.time()
    g.request_start_time = time.time()
    elapsed_time = lambda: "%.5f seconds" % (time.time() - g.request_start_time)
    logger.info(elapsed_time)
    g.request_time = elapsed_time


@app.after_request
def after_request(response):
    try:
        diff = time.time() - g.start
    except AttributeError as err:
        flash(str(err))
        logger.error(str(err))
        diff = 0
    if (
        (response.response)
        and (200 <= response.status_code < 300)
        and (response.content_type.startswith("text/html"))
    ):
        response.set_data(
            response.get_data().replace(
                b"__EXECUTION_TIME__", bytes(str(diff), "utf-8")
            )
        )
    return response


@app.route("/graph_components", methods=["GET"])
def graph_components():
    graph_components = compute.graph_components_from_files()
    return json.dumps(graph_components)

@app.route("/index", methods=["GET", "POST"])
@app.route("/", methods=["GET", "POST"])
def index():
    logger.info("[trace]")
    from pudb import set_trace
    #set_trace()
    webform = SearchString()
    if request.method == "POST":
        logger.debug("request.form = %s", request.form)
        search_string = False
        request_obj = request
        search_string = request_obj.form['text']
        if search_string:
            graph_components = compute.graph_components_from_files(search_string)
            return render_template("index.html",
            json_for_d3js=graph_components,
            webform=webform)

    try:
        graph_components = compute.graph_components_from_files()
     
    except Exception as err:
        logger.error(str(err))
        flash(str(err))
        graph_components = ""

    return render_template("index.html",
        json_for_d3js=graph_components,
        webform=webform)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

# EOF
