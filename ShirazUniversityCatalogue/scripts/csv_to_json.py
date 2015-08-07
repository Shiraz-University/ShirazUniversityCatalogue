import sys
import json

def csv_to_dic(lines):
	res_dic = {}
	for line in lines:
		line = line.strip()
		frags = line.split(',')
		if len(frags) == 2:
			res_dic[frags[0]] = frags[1]
		else:
			res_dic[frags[0]] = frags[1:]
	return res_dic
def csv_to_json(lines):
	return json.dumps(csv_to_dic(lines))


if __name__ == '__main__':
	
	with open(sys.argv[1],'r') as infile, open(sys.argv[2],'w') as outfile:
		lines = infile.readlines()
		json_string = csv_to_json(lines)
		outfile.write(json_string)
