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
