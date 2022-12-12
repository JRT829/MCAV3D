from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import requests 
from google.transit import gtfs_realtime_pb2
from requests.structures import CaseInsensitiveDict
import json
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
        speed=[]
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
            routeid.append(entity.vehicle.trip.route_id)
            stopid.append(entity.vehicle.stop_id) 
            if entity.vehicle.position.speed is not None:
                speed.append(entity.vehicle.position.speed)
        #Putting all the information into one array(socket does not support object orientation for some reason) 
        info=[latitude,longitude,routeid,stopid,speed]
        #Pushing the info of that vehicle type onto the master array
        data.append(info)
        

    #Sending data to client(update.js)            
    emit('data',data)


#Extracting stop that tram is arriving to
@socketio.on('stop')
def handlestop(stopid):
    #Creating url with stop id to find the station name(Using the Trip Planner API)
    requesturl='https://api.transport.nsw.gov.au/v1/tp/stop_finder?outputFormat=rapidJSON&type_sf=stop&name_sf='+str(stopid)+'&coordOutputFormat=EPSG%3A4326&TfNSWSF=true&version=10.2.1.42'
    #Making the request(same authorization) 
    req = requests.get(requesturl,headers=headers)
    #Retrieving data and converting it to json for object manipulation 
    reqcontent=req.content
    jsonResponse = json.loads(reqcontent.decode('utf-8'))
    #Getting the station name 
    station=jsonResponse['locations'][0]['name']
    #Sending the name back to the client(update.js)
    emit('stopcall',station)

        
    
    

#Connecting flask code with html 
@app.route('/')
def route():
    return render_template('index.html')
#Creating local server 
if __name__ == "__main__":
    
    eventlet.wsgi.server(eventlet.listen(('127.0.0.1', 5000)), app)
   






