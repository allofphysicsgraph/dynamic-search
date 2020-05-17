def regex_and_or(pattern,delimiter='\s+',data=''):
    import re
    ands = re.split(delimiter,pattern)
    data = """Normally matches any character except a newline.
Within square brackets the dot is literal. """
    match_list = []
    
    for line in data.splitlines():
        ignore_line = False
        for word in ands:
            if not re.findall(word,line):
                ignore_line = True
        if not ignore_line:
            match_list.append(line)
    return match_list


regex_and_or('(Normally|With) (anyf|char)? square')
#['Within square brackets the dot is literal. ']
