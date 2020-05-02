def process_file(file_path,file_name,readlines=False,w=False,a=False,data=False):
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
        f.close()
        return file_obj
    
    except Exception as e:
        print(e)

def search_dict_keys(pattern,dct,exact=False):
    import re
    match_lst = [] 
    if exact:
        search = lambda x: True if  re.findall(r'^{}$'.format(pattern),str(x)) else False
    else:
        search = lambda x: True if  re.findall("{}".format(pattern),str(x)) else False
    if isinstance(dct,dict):
        for k,v in dct.items():
            if search(k,pattern):
                match_lst.append({k:v})
            

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

def get_node_list(path,file_name,node_keys=False):
    import json
    if not node_keys:
        node_keys = ["id","group","img", "width", "height", "linear index"] 
    #from pudb import set_trace
    #set_trace()
    node_list = []
    json_file = process_file(path,file_name,readlines=True)
    for line in json_file:
        dict_json=json.loads(line) 
        if isinstance(dict_json,dict):
            node_list.append(dict_json)
    if node_list:
        return node_list

def get_edge_list(path,file_name):
    import json
    if not edge_keys:
        edge_keys = ["source","target", "value"] 
    file_obj = process_file(path,file_name,'r')
    dict_json=json.loads(file_obj)
    if isinstance(dict_json,dict):
        return dict_json


def get_transition_list(path,file_name):
    import json
    if not edge_keys:
        edge_keys = ["source","target", "value"] 
    file_obj = process_file(path,file_name,'r')
    dict_json=json.loads(jtopy)
    if isinstance(dict_json,dict):
        return dict_json

