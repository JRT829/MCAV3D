import requests 
from google.transit import gtfs_realtime_pb2
from requests.structures import CaseInsensitiveDict
import json

#API access
headers=CaseInsensitiveDict()
headers['Authorization']="apikey PtFM8NeyUIGV6RS5hwTWOGiyC2IINOTtHxZz"
url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/lightrail/innerwest"
resp = requests.get(url,headers=headers)
responsebody=resp.content

#Converting protobuf format into object for manipulation 
feed = gtfs_realtime_pb2.FeedMessage()
feed.ParseFromString(responsebody)
#print(feed.entity) 
print(feed)
#Retrieving coordinates 
latitude=[]
longitude=[]
routeid=[]
for entity in feed.entity:
   latitude.append(entity.vehicle.position.latitude)
   longitude.append(entity.vehicle.position.longitude)
   routeid.append(entity.vehicle.trip.route_id)

print(routeid)

requesturl='https://api.transport.nsw.gov.au/v1/tp/stop_finder?outputFormat=rapidJSON&type_sf=stop&name_sf='+'10101100'+'&coordOutputFormat=EPSG%3A4326&TfNSWSF=true&version=10.2.1.42'
req = requests.get(requesturl,headers=headers)
reqcontent=req.content
jsonResponse = json.loads(reqcontent.decode('utf-8'))
station=jsonResponse['locations'][0]['name']
print(station)
