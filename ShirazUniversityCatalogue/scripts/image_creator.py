import json
import requests
import shutil
import sys
import urllib
from pprint import pprint

def create_request(prefix,**kwargs):
	return prefix + urllib.urlencode(kwargs)

def translate_latlng(lat, lng, language = 'fa'):
	url_prefix = 'https://maps.googleapis.com/maps/api/geocode/json?'
	get_url = create_request(url_prefix,
		latlng = str(lat) + ',' + str(lng), language = language)
	data = requests.get(get_url)
	try:
		return data.json()['results'][0]['formatted_address']
	except:
		return None

def get_map_image((lat,lng), zoom = 17, size = '500x500',scale = 2,format = 'png',
	maptype = 'roadmap', language = 'fa', markers = [] ):
	url_prefix = 'https://maps.googleapis.com/maps/api/staticmap?'
	param_dict = {
		'center': str(lat) + ',' + str(lng),
		'zoom': zoom,
		'size': size,
		'scale': scale,
		'format': format,
		'maptype': maptype,
		'language': language,
		'markers': markers
	}
	if markers == []:
		del param_dict['markers']
	get_url = create_request(url_prefix,**param_dict)
	resp = requests.get(get_url, stream = True)
	return resp

def parse_cl_args(cl_args):
	names = cl_args[::2]
	values = cl_args[1::2]

	names = [x[2:] for x in names]

	return dict(zip(names,values))

def filter_args(args):
	acceptable = ['zoom','size','scale','format','maptype','language','markers']
	return {x:args[x] for x in args if x in acceptable}
if __name__ == '__main__':

	args = parse_cl_args(sys.argv[2:])

	output_addr = 'out\\'	
	if len(sys.argv) < 2:
		print "missing the json file parameter"
	else:
		if 'dest' in args:
			output_addr = args['dest']
		file_format = 'png' if 'format' not in args else args['format']

		json_file_addr = sys.argv[1]
		json_file = open(json_file_addr, 'r')

		data = json.loads(json_file.read())

		for location in data:
			lat = location['location']['latlng']['lat']
			lng = location['location']['latlng']['lng']
			
			resp = get_map_image((lat,lng), **filter_args(args))

			with open(output_addr + str(location['id']) + '_map' + '.' + file_format,'wb') as outfile:
				for chunk in resp.iter_content(1024):
					outfile.write(chunk)
