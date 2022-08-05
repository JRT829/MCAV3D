import requests 
from google.transit import gtfs_realtime_pb2
from requests.structures import CaseInsensitiveDict

#API access
headers=CaseInsensitiveDict()
headers['Authorization']="apikey 20ZUil4YfBkkGED8NegjB65z0ALHC3O5uMB0"
url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/nswtrains"
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
for entity in feed.entity:
   latitude.append(entity.vehicle.position.latitude)
   longitude.append(entity.vehicle.position.longitude)