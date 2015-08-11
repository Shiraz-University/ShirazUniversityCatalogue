import os
import sys
import urllib
import zipfile

github_file_address = 'https://github.com/Shiraz-University/ShirazUniversityCatalogueData/archive/master.zip'

if __name__ == '__main__':
	output_dir = os.path.join(sys.argv[1],'')
	urllib.urlretrieve(github_file_address,'data.zip')
	with zipfile.ZipFile('data.zip', 'r') as z:
		z.extractall(output_dir)
