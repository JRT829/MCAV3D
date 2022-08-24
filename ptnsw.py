from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import requests 
from google.transit import gtfs_realtime_pb2
from requests.structures import CaseInsensitiveDict
import eventlet
import time 




#API access


#print(feed.entity) 

#Retrieving coordinates 

headers=CaseInsensitiveDict()
headers['Authorization']="apikey PtFM8NeyUIGV6RS5hwTWOGiyC2IINOTtHxZz"
url="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/lightrail/cbdandsoutheast"

app = Flask(__name__)
app.config['SECRET KEY']='mysecret'
socketio =  SocketIO(app,cors_allowed_origins="*")
app.debug = True

#SocketIO(app, logger=True, engineio_logger=True, policy_server=False, async_mode='eventlet', manage_session=False, cors_allowed_origins="*")

@socketio.on('spawn')
def event():
    
    
   
    coordinates=[]
    latitude=[]
    longitude=[]
    resp = requests.get(url,headers=headers)
    responsebody=resp.content

    #Converting protobuf format into object for manipulation 
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(responsebody)
                
    for entity in feed.entity:
        latitude.append(entity.vehicle.position.latitude)
        longitude.append(entity.vehicle.position.longitude)
    coordinates=[latitude,longitude]
                
    emit('tram',coordinates)
            
        

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data )
    
    


@app.route('/')
def route():
    return render_template('index.html')
if __name__ == "__main__":
    eventlet.monkey_patch()
    eventlet.wsgi.server(eventlet.listen(('127.0.0.1', 5000)), app)
    #socketio.run(app) 






