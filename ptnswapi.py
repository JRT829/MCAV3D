import requests 
from google.transit import gtfs_realtime_pb2
from requests.structures import CaseInsensitiveDict

#API access
headers=CaseInsensitiveDict()
headers['Authorization']="apikey PtFM8NeyUIGV6RS5hwTWOGiyC2IINOTtHxZz"
url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/lightrail/cbdandsoutheast"
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