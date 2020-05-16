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

from pudb import set_trace


def process_file(
    file_path, file_name, readlines=False, w=False, a=False, data=False, strip=False
):
    try:
        if w and data:
            # print("Write")
            # print(file_path,file_name)
            f = open(file_path + file_name, "w")
            f.write(data)
            f.close()
            return True

        if a and data:
            # print("Append")
            f = open(file_path + file_name, "a+")
            f.write(data)
            f.close()
            return True
        else:
            f = open(file_path + file_name, "rb")
        if not readlines:
            file_obj = f.read()
        else:
            file_obj = f.readlines()
            if strip:
                file_obj = [x.strip() for x in file_obj if x]
        f.close()
        return file_obj

    except Exception as e:
        print(e)


def filter_dct(pattern, dct, filter_keys=False, filter_values=True, exact=False):
    import re

    filtered_results = {}
    list_of_dcts = []
    if exact:
        search = (
            lambda x: True if re.findall(r"^{}$".format(pattern), str(x)) else False
        )
    else:
        search = lambda x: True if re.findall("{}".format(pattern), str(x)) else False
    # set_trace()
    if filter_keys:
        if isinstance(dct, dict):
            for k, v in dct.items():
                if search(k):
                    filtered_results[k] = v
        if isinstance(dct, list):
            for dictionary in dct:
                for k, v in dictionary.items():
                    if search(k):
                        list_of_dcts.append(dictionary)

    if filter_values:
        if isinstance(dct, dict):
            for k, v in dct.items():
                if search(v):
                    filtered_results[k] = v
        if isinstance(dct, list):
            for dictionary in dct:
                for k, v in dictionary.items():
                    if search(v):
                        list_of_dcts.append(dictionary)

    if filtered_results:
        return filtered_results
    if list_of_dcts:
        return list_of_dcts


def generate_id(lst):
    from random import choice

    idx = choice(list(set(range(1, 1000000)).difference(set(lst))))
    if idx:
        return idx
    else:
        from time import time

        almost_now = time()
        error_message = f"Failed to generate id {almost_now}"
        return error_message


def get_node_list(path, file_name, node_keys=False, strip=True):
    import json

    if not node_keys:
        node_keys = ["id", "group", "img", "width", "height", "linear index"]
    node_list = []
    json_file = process_file(path, file_name, readlines=True)
    for line in json_file:
        dict_json = json.loads(line)
        if isinstance(dict_json, dict):
            node_list.append(dict_json)
    if node_list:
        return node_list


def get_edge_list(path, file_name, edge_keys=False, strip=True):
    import json

    if not edge_keys:
        edge_keys = ["source", "target", "value"]
    edge_list = []
    json_file = process_file(path, file_name, readlines=True)
    for line in json_file:
        dict_json = json.loads(line)
        if isinstance(dict_json, dict):
            edge_list.append(dict_json)
    if edge_list:
        return edge_list


def get_transition_list(path, file_name, transition_keys=False, strip=True):
    import json

    if not transition_keys:
        transition_keys = ["source", "target", "value"]
    transition_list = []
    json_file = process_file(path, file_name, readlines=True)
    for line in json_file:
        dict_json = json.loads(line)
        if isinstance(dict_json, dict):
            transition_list.append(dict_json)
    if transition_list:
        return transition_list


def graph_components_from_files(
    pattern=False, filter_keys=False, filter_values=True
) -> str:
    from compute import process_file
    from compute import get_edge_list
    from compute import get_node_list
    from compute import get_transition_list
    node_list_ids = []
    filtered_transition_list = []
    dct = {}
    logger.info("[trace]")
    static_path = "/home/user/dynamic-search/static/"
    data_source = static_path + "data_source/"
    node_list = get_node_list(data_source, "node_list.json")
    edge_list = get_edge_list(data_source, "edge_list.json")
    transition_list = get_transition_list(data_source, "transition_list.json")
    if pattern:
        node_list = filter_dct(pattern, node_list)
        edge_list = filter_dct(pattern, edge_list)
        transition_list = filter_dct(pattern, transition_list)

    if node_list:
        for node in node_list:
            node_list_ids.append(node['id'])

    if transition_list:
        for edge in transition_list:
            if edge['source'] in node_list_ids and edge['target'] in node_list_ids:
                filtered_transition_list.append(edge)

    if node_list:
        dct['nodes'] = node_list
        
    if filtered_transition_list:
        dct["links"] = filtered_transition_list
    
    

    return dct
