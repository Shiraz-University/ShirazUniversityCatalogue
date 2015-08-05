import os
import sys
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

class DriveWrapper:

	def __init__(self, gauth):
		self.drive = GoogleDrive(gauth)

	def ls(self,parent = {'id' : 'root'},title = None,
		just_folders = False,just_files = False):
		q = "'{}' in parents and trashed=false" + \
		('' if title is None else " and title contains '{}'".format(title)) + \
		('' if just_folders is False else " and mimeType='application/vnd.google-apps.folder'") + \
		('' if just_files is False else " and mimeType!='application/vnd.google-apps.folder'")
		return self.drive.ListFile({'q' : q.format(parent['id'])}).GetList()

def ensure_dir(d):
	if not os.path.exists(d):
		os.makedirs(d)

PLACES_DIR_NAME = 'uni-places'
#the folder where downloaded folders will be exported into
EXPORT_LOCATION = ''

if __name__ == '__main__':

	if len(sys.argv) > 1:
		EXPORT_LOCATION = sys.argv[1]
		if EXPORT_LOCATION[-1] != '\\':
			EXPORT_LOCATION += '\\'

	gauth = GoogleAuth()
	gauth.LocalWebserverAuth()

	drive = DriveWrapper(gauth)

	file_list = drive.ls(title = PLACES_DIR_NAME, just_folders = True)
	assert(len(file_list) == 1)

	place_folders = drive.ls(parent = file_list[0], just_folders = True)

	print "..."
	for place_folder in place_folders:
		ensure_dir(EXPORT_LOCATION + place_folder['title'] + '\\')
		desc_file = drive.ls(parent = place_folder, title = 'desc')
		print desc_file[0]['alternateLink']
		detail_file = drive.ls(parent = place_folder, title = 'detail')
		desc_content = desc_file[0].GetContentFile(EXPORT_LOCATION + place_folder['title'] + '\\' + 'desc.html', mimetype = 'text/html')
		detail_content = detail_file[0].GetContentFile(EXPORT_LOCATION + place_folder['title'] + '\\' + 'detail.csv', mimetype = 'text/csv')
