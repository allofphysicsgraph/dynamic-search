#!/usr/bin/env python3
import json
from functools import wraps
import errno
import signal
import os
import shutil  # move and copy files
import datetime
from subprocess import PIPE  # https://docs.python.org/3/library/subprocess.html
import subprocess  # https://stackoverflow.com/questions/39187886/what-is-the-difference-between-subprocess-popen-and-subprocess-run/39187984
import random
import logging
import collections
from typing import Tuple, TextIO, List  # mypy
from typing_extensions import (
    TypedDict,
)  # https://mypy.readthedocs.io/en/stable/more_types.html


logger = logging.getLogger(__name__)

# global proc_timeout
proc_timeout = 30

{
          "nodes": [
                  {"id": "Myriel", "group": 1, "img": "/static/test.png", "width": 138, "height": 39, "linear index": 1},
                      {"id": "Napoleon", "group": 1, "img": "/static/test.png", "width": 138, "height": 39, "linear index": 2}
                        ],
            "links": [
                    {"source": "Napoleon", "target": "Myriel", "value": 1},
                        {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8}
                          ]
            }

def create_d3js_json() -> str:
    from vis_test import process_file

    logger.info("[trace]")
    static_path = "/home/appuser/dynamic-search/static/"
    d3js_json_filename = "my_graph.json"
    fil = process_file(static_path, d3js_json_filename, "w",d3js_json_filename)
    file_obj = process_file(static_path, d3js_json_filename, "r")
    return file_obj
