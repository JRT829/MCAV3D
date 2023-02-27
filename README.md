# MCAV3D
A 3D visualisation of New South Wales Public Transport API with the use of Mapbox and tfnsw


# API Keys
* [Mapbox](https://www.mapbox.com/)
* [tfnsw](https://opendata.transport.nsw.gov.au/)
  * Create account
  * Click on My Account -> Application -> Add Application 
  * Add the following API
    * Public Transport - Realtime Vehicle Positions API
    * Public Transport - Timetables - For Realtime
    * Public Transport - Realtime Trip Update API v2
    * Public Transport - Realtime Trip Updates API
    * Public Transport - Timetables - Complete - GTFS
    * Trip Planner APIs
    * Public Transport - Realtime - Alerts - v2

# Requirements 
* C++ (for the 3D visualisation program threebox)
  * [threebox](https://github.com/peterqliu/threebox)
* Python 3.8
* Visual Studio Code 
* NOT COMPATIBLE WITH MAC OS  

# Installation
* Clone repo 
* Launch virtual env `env/bin/activate`
* Install `requirements.txt`
* Insert API keys 
  * tfnsw API key: `ptnsw.py` and `ptnswapi.py` at `headers['Authorization']`
  * Mapbox API key: `static/js/maps.js` at `mapboxgl.accesstoken`

# Launching the applicaiton
* Run and Debug(VS Code) 
* type Flask in prompt
* type the python file name (ptnsw.py)
* ctrl click link(http://127.0.0.1:5000) in terminal 

# NOTE
Since threebox code covers 95% of the code(had to do a raw install), the following files/folders are the core functionality of the code 
MCAV3D/                                                     
├── template
   └──index.html
└── static
    └──js 
└── ptnsw.py
└── ptnswapi.py(for testing purposes)
       

# Common Errors and Bugs



# Contact 
* email: jtay0051@student.monash.edu
* fb: Jin Ren Tay 
