import json
import os
import shutil
import sys
import glob
from csv_to_json import csv_to_dic


def get_path_parts(path):

	return [x for x in path.split(os.sep) if x]

def find_part_in_children(children, name):
	for ch in children:
		if ch['type'] == 'folder' and ch['name'] == name:
			return ch

def ensure_path(parts, dic):

	last_part = dic

	for part in parts:
		last_part_child = find_part_in_children(last_part['children'], part)
		if last_part_child == None:
			last_part['children'].append({
				'type': 'folder',
				'name': parts[-1],
				'children': []
				})
			#return the current appended child
			return last_part['children'][-1]
		else:
			last_part = last_part_child
	return last_part


if __name__ == '__main__':

    in_directory = os.path.join(sys.argv[1], '')
    base_len = len(get_path_parts(in_directory))
    #json_out_file = sys.argv[2]
    
    contents = {
    'type': 'folder',
    'name': '',
    'children': []
    }

    for path, folders, files in os.walk(unicode(in_directory, 'utf8')):
    	parts = get_path_parts(path)[base_len:]
    	current_node = ensure_path(parts, contents)

    	for fname in files:
    		file_path = os.path.join(path, fname)
    		file_content = None
    		with open(file_path, 'r') as infile:
    			file_content = infile.read()
    		current_node['children'].append({
    			'type': 'content',
    			'title': os.path.splitext(fname)[0], #name of the file without extension
    			'content': file_content
    			})

    print json.dumps(contents, indent = 4)

