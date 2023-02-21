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

print(feed)

class tram:
   def __init__(self,latitude,longitude,routeid):
      self.latitude=latitude
      self.longitude=longitude
      self.routeid=routeid

tramlist=[]
for entity in feed.entity:
   latitudetemp=entity.vehicle.position.latitude
   longitudetemp=entity.vehicle.position.longitude
   routeidtemp= entity.vehicle.trip.route_id
   tramlist.append(tram(latitudetemp,longitudetemp,routeidtemp))


print(tramlist)

#reverse geolocation
requesturl='https://api.transport.nsw.gov.au/v1/tp/stop_finder?outputFormat=rapidJSON&type_sf=stop&name_sf='+'10101100'+'&coordOutputFormat=EPSG%3A4326&TfNSWSF=true&version=10.2.1.42'
req = requests.get(requesturl,headers=headers)
reqcontent=req.content
jsonResponse = json.loads(reqcontent.decode('utf-8'))
station=jsonResponse['locations'][0]['name']
print(reqcontent)
