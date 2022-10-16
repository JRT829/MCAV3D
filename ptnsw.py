from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import requests 
from google.transit import gtfs_realtime_pb2
from requests.structures import CaseInsensitiveDict
import eventlet
#Server with API data



#API access
headers=CaseInsensitiveDict()
headers['Authorization']="apikey PtFM8NeyUIGV6RS5hwTWOGiyC2IINOTtHxZz"
#Different transport options
url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/lightrail/cbdandsoutheast"
url2="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/lightrail/innerwest"
url3="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/buses"
url4="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/sydneytrains"
#url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/ferries/sydneyferries"
#url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/sydneytrains"
#url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/lightrail/buses"


#App settings 
app = Flask(__name__)
app.config['SECRET KEY']='mysecret'
socketio =  SocketIO(app,cors_allowed_origins="*")
app.debug = True

#SocketIO(app, logger=True, engineio_logger=True, policy_server=False, async_mode='eventlet', manage_session=False, cors_allowed_origins="*")

#Extracting tram data from API
@socketio.on('spawn')
def event():
    
    
    #Initialising variables 
    coordinates=[]
    latitude=[]
    longitude=[]
    coordinates2=[]
    latitude2=[]
    longitude2=[]
    coordinates3=[]
    latitude3=[]
    longitude3=[]
    coordinates4=[]
    latitude4=[]
    longitude4=[]

    #Making the request
    resp = requests.get(url,headers=headers)
    responsebody=resp.content
    resp2 = requests.get(url2,headers=headers)
    responsebody2=resp2.content
    resp3 = requests.get(url3,headers=headers)
    responsebody3=resp3.content
    resp4 = requests.get(url4,headers=headers)
    responsebody4=resp4.content

    #Converting protobuf format into object for manipulation 
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(responsebody)
    feed2 = gtfs_realtime_pb2.FeedMessage()
    feed2.ParseFromString(responsebody2)
    feed3 = gtfs_realtime_pb2.FeedMessage()
    feed3.ParseFromString(responsebody3)
    feed4 = gtfs_realtime_pb2.FeedMessage()
    feed4.ParseFromString(responsebody4)

    #Looping to get each vehicles co-ordinates           
    for entity in feed.entity:
        latitude.append(entity.vehicle.position.latitude)
        longitude.append(entity.vehicle.position.longitude)
    coordinates=[latitude,longitude]
    for entity2 in feed2.entity:
        latitude2.append(entity2.vehicle.position.latitude)
        longitude2.append(entity2.vehicle.position.longitude)
    coordinates2=[latitude2,longitude2]
    for entity3 in feed3.entity:
        latitude3.append(entity3.vehicle.position.latitude)
        longitude3.append(entity3.vehicle.position.longitude)
    coordinates3=[latitude3,longitude3]
    for entity4 in feed4.entity:
        latitude4.append(entity4.vehicle.position.latitude)
        longitude4.append(entity4.vehicle.position.longitude)
    coordinates4=[latitude4,longitude4]

    #Sending data to client(index.html)            
    emit('tram',coordinates)
    emit('tram2',coordinates2)
    emit('bus',coordinates3)
    emit('train',coordinates4)
            
        
    
    

#Connecting flask code with html 
@app.route('/')
def route():
    return render_template('index.html')
#Creating local server 
if __name__ == "__main__":
    eventlet.monkey_patch()
    eventlet.wsgi.server(eventlet.listen(('127.0.0.1', 5000)), app)
   






