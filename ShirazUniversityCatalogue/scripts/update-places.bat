rm -r ..\data\ShirazUniversityCatalogueData-master\
python download_github.py ..\data\
python collect_places.py ..\data\ShirazUniversityCatalogueData-master\ ..\www\json\places.json ..\www\place_templates\