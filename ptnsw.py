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
url3="https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/sydneytrains"



#App settings 
app = Flask(__name__)
app.config['SECRET KEY']='mysecret'
socketio =  SocketIO(app,cors_allowed_origins="*")
app.debug = True
urllist=[url,url2]

#SocketIO(app, logger=True, engineio_logger=True, policy_server=False, async_mode='eventlet', manage_session=False, cors_allowed_origins="*")

#Extracting tram data from API
@socketio.on('spawn')
def event():
    data=[]
    for x in range(len(urllist)):
    #Initialising variables 
        info=[]
        latitude=[]
        longitude=[]
        bearing=[]
        routeid=[]
        stopid=[]

    

        #Making the request
        resp = requests.get(urllist[x],headers=headers)
        responsebody=resp.content
        

        #Converting protobuf format into object for manipulation 
        feed = gtfs_realtime_pb2.FeedMessage()
        feed.ParseFromString(responsebody)
        

        #Looping to get each vehicles co-ordinates           
        for entity in feed.entity:
            latitude.append(entity.vehicle.position.latitude)
            longitude.append(entity.vehicle.position.longitude)
            bearing.append(entity.vehicle.position.bearing)
            routeid.append(entity.vehicle.trip.route_id)
            stopid.append(entity.vehicle.stop_id) 
        #Putting all the information into one array(socket does not support object orientation for some reason) 
        info=[latitude,longitude,routeid,stopid]
        #Pushing the info of that vehicle type onto the master array
        data.append(info)
        

    #Sending data to client(index.html)            
    emit('data',data)
    
            
        
    
    

#Connecting flask code with html 
@app.route('/')
def route():
    return render_template('index.html')
#Creating local server 
if __name__ == "__main__":
    
    eventlet.wsgi.server(eventlet.listen(('127.0.0.1', 5000)), app)
   






