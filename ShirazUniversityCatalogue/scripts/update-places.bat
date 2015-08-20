rm -r ..\data\ShirazUniversityCatalogueData-master\
python download_github.py ..\data\
python collect_places.py ..\data\ShirazUniversityCatalogueData-master\Places ..\www\json\places.json ..\www\place_templates\