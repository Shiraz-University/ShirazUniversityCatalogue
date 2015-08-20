import json
import os
import shutil
import sys
from csv_to_json import csv_to_dic

if __name__ == '__main__':

#    add the trailing / or \ os independently
    in_directory = os.path.join(sys.argv[1], '')
    #csv_out_file = os.path.join(sys.argv[2], '')
    json_out_file = sys.argv[2]
    html_out_directory = os.path.join(sys.argv[3], '')

#   list the place type folders
#   all the places are divided by folders for example departments, classes,
#   shops, etc.
    place_type_dirs = os.listdir(in_directory)

    places = {}

    for place_type_dir in place_type_dirs:
        places[place_type_dir] = []
        places_in_place_type_dirs = os.listdir(os.path.join(in_directory, place_type_dir))

        for placedir in places_in_place_type_dirs:
            base_path = os.path.join(in_directory, place_type_dir, placedir)
            place_desc_filename = os.path.join(base_path, 'desc.html')
            place_detail_filename = os.path.join(base_path, 'detail.csv')
            current_dict = None
            #add the current place to json
            with open(place_detail_filename, 'r') as file_details:
                dic_object = csv_to_dic(file_details.readlines())
                current_dict = dic_object
                places[place_type_dir].append(dic_object)
            #copy the current place html to the templates folder
            print os.path.join(html_out_directory, dic_object['id'])
            shutil.copyfile(place_desc_filename, os.path.join(html_out_directory, current_dict['id']) + '.html')

    with open(json_out_file, 'w') as csv_out:
        csv_out.write(json.dumps(places))