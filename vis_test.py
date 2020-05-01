def error_log(function_name,error_message):
        from time import time
        almost_now = time()
        error_message = f"Failed to {function_name} {almost_now}\n{error_message}"
        return error_message

def process_file(file_path,file_name,readlines=False,w=False,a=False,data=False):
    try:
        if w and data:
            f = open(file_path+file_name,'w')
            f.write(data)
            f.close()
            return True

        if a and data:
            f = open(file_path+file_name,'a+')
            f.write(data)
            f.close()
            return True
        
        else:
            f = open(file_path+file_name,'a+')
        
        if not readlines:
            file_obj = f.read()
        else:
            file_obj = f.readlines()
        f.close()
        return file_obj
    
    except Exception as e:
        print(e)

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

def get_node_list(file_name,node_keys=False):
    import json
    if not node_keys:
        node_keys = ["id","group","img", "width", "height", "linear index"] 
    file_obj = read_file(path,file_name)
    dct = json.loads(file_obj)
    if isinstance(dct,dict):
        return dct
    else:
        error_log('node_list')

def get_edge_list(file_name):
    import json
    if not edge_keys:
        edge_keys = ["source","target", "value"] 
    file_obj = read_file(path,file_name)
    dct = json.loads(file_obj)
    if isinstance(dct,dict):
        return dct
    else:
        error_log('edge_list')

