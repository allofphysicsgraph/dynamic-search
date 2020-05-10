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
def process_file(file_path,file_name,readlines=False,w=False,a=False,data=False,strip=False):
    try:
        if w and data:
            print("Write")
            print(file_path,file_name)
            f = open(file_path+file_name,'w')
            f.write(data)
            f.close()
            return True

        if a and data:
            print("Append")
            f = open(file_path+file_name,'a+')
            f.write(data)
            f.close()
            return True
        else:
            f = open(file_path+file_name,'rb')
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

def filter_dct(pattern,dct,filter_keys=False,filter_values=True,exact=False):
    import re
    filtered_results = {}
    list_of_dcts = [] 
    if exact:
        search = lambda  x: True if  re.findall(r'^{}$'.format(pattern),str(x)) else False
    else:
        search = lambda  x: True if  re.findall("{}".format(pattern),str(x)) else False
    #set_trace()
    if filter_keys:
        if isinstance(dct,dict):
            for k,v in dct.items():
                if search(k):
                    filtered_results[k]  = v
        if isinstance(dct,list):
            for dictionary in dct:
                for k,v in dictionary.items():
                    if search(k):
                        list_of_dcts.append(dictionary)

    if filter_values:
        if isinstance(dct,dict):
            for k,v in dct.items():
                if search(v):
                    filtered_results[k]  = v
        if isinstance(dct,list):
            for dictionary in dct:
                for k,v in dictionary.items():
                    if search(v):
                        list_of_dcts.append(dictionary)
        
    #set_trace()
    if filtered_results:
        return filtered_results
    if list_of_dcts:
        return list_of_dcts

def generate_id(lst):
    from random import choice
    idx = choice(list(set(range(1,1000000)).difference(set(lst))))
    if idx:
        return idx
    else:
        from time import time
        almost_now = time()
        error_message = f"Failed to generate id {almost_now}"
        return error_message

def get_node_list(path,file_name,node_keys=False,strip=True):
    import json
    if not node_keys:
        node_keys = ["id","group","img", "width", "height", "linear index"] 
    node_list = []
    json_file = process_file(path,file_name,readlines=True)
    for line in json_file:
        dict_json=json.loads(line) 
        if isinstance(dict_json,dict):
            node_list.append(dict_json)
    if node_list:
        return node_list

def get_edge_list(path,file_name,edge_keys=False,strip=True):
    import json
    if not edge_keys:
        edge_keys = ["source","target", "value"] 
    edge_list = []
    #set_traset_trace()
    json_file = process_file(path,file_name,readlines=True)
    for line in json_file:
        dict_json=json.loads(line) 
        if isinstance(dict_json,dict):
            edge_list.append(dict_json)
    if edge_list:
        return edge_list


def get_transition_list(path,file_name,transition_keys=False,strip=True):
    import json
    if not transition_keys:
        transition_keys = ["source","target", "value"] 
    transition_list = []
    json_file = process_file(path,file_name,readlines=True)
    for line in json_file:
        dict_json=json.loads(line) 
        if isinstance(dict_json,dict):
            transition_list.append(dict_json)
    if transition_list:
        return transition_list



def graph_components_from_files(pattern=False,filter_keys=False,filter_values=True) -> str:
    from compute import process_file
    from compute import get_edge_list
    from compute import get_node_list
    from compute import get_transition_list
    from pudb import set_trace
    logger.info("[trace]")
    static_path = "/home/user/Desktop/dynamic-search/static/"
    data_source = static_path + 'data_source/'
    #d3js_json_filename = "my_graph.json"
    #fil = process_file(data_source, d3js_json_filename, "w",d3js_json_filename)
    #set_trace()
    node_list =  get_node_list(data_source,'node_list.json')
    edge_list =  get_edge_list(data_source,'edge_list.json')
    transition_list =  get_transition_list(data_source,'transition_list.json')
    if pattern:
        node_list = filter_dct(pattern,node_list)
        edge_list = filter_dct(pattern,edge_list)
        transition_list = filter_dct(pattern,transition_list)

    dct ={
        "nodes":node_list,
        "links":transition_list
    }
    print(dct)
    return dct


def create_d3js_json() -> str:
    """
    Produce a JSON file that contains something like
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

    """
    logger.info("[trace]")

    d3js_json_filename = "my_graph.json"

    node_list = ['94922', '9913', '4241','4942', '49424', '242492', '13942']

    json_str = "{\n"
    json_str += '  "nodes": [\n'
    list_of_nodes = []
    for step_id in node_list:
        png_name='error'
        list_of_nodes.append(
    '    {"id": "'+step_id+'", "group": 1, "img": "/static/'+png_name+'.png", "width": 113, "height": 43, "linear index": 1},\n')

    list_of_nodes = list(set(list_of_nodes))
    all_nodes = "".join(list_of_nodes)
    all_nodes = (
        all_nodes[:-2] + "\n"
    )  # remove the trailing comma to be compliant with JSON
    json_str += all_nodes

    json_str += "  ],\n"
    json_str += '  "links": [\n'

    list_of_edges = [('94922', '9913'), ('9913', '4241'), ('49424', '242492'), ('242492', '13942')]
    list_of_edge_str = []
    for edge_tuple in list_of_edges:
        list_of_edge_str.append(
            '    {"source": "'
            + edge_tuple[0]
            + '", "target": "'
            + edge_tuple[1]
            + '", "value": 1},\n'
        )
    list_of_edge_str = list(set(list_of_edge_str))
    # logger.debug('number of edges = %s', len(list_of_edge_str))
    all_edges = "".join(list_of_edge_str)
    all_edges = all_edges[:-2] + "\n"
    # logger.debug('all edges = %s', all_edges)
    json_str += all_edges
    json_str += "  ]\n"
    json_str += "}\n"
    print(json_str)
    with open("/home/user/Desktop/dynamic-search/static/" + d3js_json_filename, "w") as fil:
        fil.write(json_str)

    return d3js_json_filename


# EOF
