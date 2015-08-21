rm -r ..\data\ShirazUniversityCatalogueData-master\
python download_github.py ..\data\
python collect_places.py ..\data\ShirazUniversityCatalogueData-master\Places ..\www\json\places.json ..\www\place_templates\
python collect_content.py ..\data\ShirazUniversityCatalogueData-master\Content > ..\www\json\contents.json