from flask import Flask, render_template
from flask_socketio import SocketIO,  emit
import requests 
from google.transit import gtfs_realtime_pb2
from requests.structures import CaseInsensitiveDict





#API access
headers=CaseInsensitiveDict()
headers['Authorization']="apikey 20ZUil4YfBkkGED8NegjB65z0ALHC3O5uMB0"
url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/lightrail/cbdandsoutheast"
resp = requests.get(url,headers=headers)
responsebody=resp.content

#Converting protobuf format into object for manipulation 
feed = gtfs_realtime_pb2.FeedMessage()
feed.ParseFromString(responsebody)
#print(feed.entity) 

#Retrieving coordinates 
latitude=[]
longitude=[]
for entity in feed.entity:
   latitude.append(entity.vehicle.position.latitude)
   longitude.append(entity.vehicle.position.longitude)


app = Flask(__name__)
socketio = SocketIO(app) 


@app.route("/", methods=['POST', 'GET'])

def senddata():
    coordinates=[latitude,longitude]
  

    return render_template('index.html',coordinates=coordinates) 

@socketio.event
def my_event(message):
    emit('my response', {'data': 'got it!'})

if __name__ == "__main__":
    socketio.run(app)






