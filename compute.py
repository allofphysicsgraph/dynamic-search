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

def create_d3js_json() -> str:
    from vis_test import process_file
    from vis_test import get_edge_list
    from vis_test import get_node_list
    from vis_test import get_transition_list
    from pudb import set_trace
    logger.info("[trace]")
    static_path = "/home/user/dynamic-search/static/"
    data_source = static_path + 'data_source/'
    d3js_json_filename = "my_graph.json"
    fil = process_file(data_source, d3js_json_filename, "w",d3js_json_filename)
    node_list =  get_node_list(data_source,'node_list.json')
    edge_list =  process_file(data_source,'edge_list.json','r')
    transitions_list =  process_file(data_source,'transitions_list.json','r')
    print(node_list,edge_list,transitions_list)
    return node_list,edge_list,transitions_list
