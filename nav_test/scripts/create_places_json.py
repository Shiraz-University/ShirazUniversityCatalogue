import json
import os
import sys
from csv_to_json import csv_to_dic

places_root = '..\\www\\places\\'

if __name__ == '__main__':
	out_dir = sys.argv[1]
	if len(sys.argv) > 2:
		places_root = sys.argv[2]

	all_places = []
	place_folders = os.listdir(places_root)
	for place_folder_name in place_folders:
		directory = os.path.join(places_root, place_folder_name)
		place_details_file_addr = os.path.join(directory, 'detail.csv')
		with open(place_details_file_addr,'r') as infile:
			lines = infile.readlines()
			place_dic = csv_to_dic(lines)
			all_places.append(place_dic)

	output_file_name = out_dir
	with open(output_file_name, 'w') as outfile:
		outfile.write(json.dumps(all_places))

