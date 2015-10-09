import sys
import os
import urllib2
import json
from multiprocessing import Pool
from pprint import pprint
from itertools import count, repeat
import my_key

nearby_requests = {
	'food': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=distance&types=food&key=' + my_key.key,
	'bank': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=distance&types=bank&key=' + my_key.key,
	'hospital': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=distance&types=hospital&key=' + my_key.key,
	'library': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=distance&types=library&key=' + my_key.key,
	'bookstore': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=distance&types=book_store&key=' + my_key.key,
	'meal_delivery': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=distance&types=meal_delivery&key=' + my_key.key,
	'movie_theater': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=distance&types=movie_theater&key=' + my_key.key,
	'parking': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&rankby=distance&types=parking&key=' + my_key.key,
}
class NearbyPlaceMerger(object):
	'''
	When we find nearby places for each of the locations of the university, there
	is a probability that many of them are duplicate. this class is responsible
	for merging the nearby places of all locations so there are no duplicates
	'''

	def __init__(self):
		self.places = []

	def add_place(self, place, nearby_id):
		self_place = self.find_place(place)
		if self_place != None:
			self_place['nearby_places'].append(nearby_id)
		else:
			place['nearby_places'] = [nearby_id]
			self.places.append(place)

	def add_places(self, places, nearby_id):
		for place in places:
			self.add_place(place, nearby_id)


	def find_place(self, place):
		for pl in self.places:
			if pl['id'] == place['id']:
				return pl
		return None

	def get_json(self):
		return json.dumps(self.places)




def combine_places(places):
	res = []
	for k in places.keys():
		res += places[k]
	return res

def download_nearby_places(((placetype,query), places)):
	merger = NearbyPlaceMerger()
	for place in places:
		# try:
		latitude = place['latitude']
		longtitude = place['longtitude']
		requst = query.format(lat = latitude, lng = longtitude)
		print requst
		request_content = urllib2.urlopen(requst).read()
		print request_content
		nearby_places = json.loads(request_content)['results']
		merger.add_places(nearby_places, place['id'])
		# except:
		# 	pass

	detail_request = 'https://maps.googleapis.com/maps/api/place/details/json?language=fa&placeid={}&key=' + my_key.key
	all_places = []
	for place in merger.places:
		# try:
		this_request = detail_request.format(place['place_id'])
		print this_request
		response = urllib2.urlopen(this_request).read()
		print response
		place_object = json.loads(response)['result']
		place_object['nearby_places'] = place['nearby_places']
		all_places.append(place_object)
		# except:
		# 	pass

	return (placetype,all_places)


if __name__ == '__main__':
	input_places_json_file_name = sys.argv[1]
	output_file_name = sys.argv[2]

	places = None
	with open(input_places_json_file_name) as places_file:
		json_places = places_file.read()
		places = json.loads(json_places)
	all_places = [x for x in combine_places(places) if x.has_key('latitude')]

	all_results = {}
	
	# for x,y in nearby_requests.items():
	# 	print 'aaa'
	# 	download_nearby_places(((x,y), all_places))

	p = Pool(10)

	with open(output_file_name, 'w') as outfile:
		outfile.write(
			json.dumps(dict(p.map(download_nearby_places,
							 zip(nearby_requests.items(),
							 	 repeat(all_places)))),
			indent = 4))
