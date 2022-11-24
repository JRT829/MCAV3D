//Initialising socket.IO server
let socket = io('http://localhost:5000');


//Icons
const tramicons= 'https://img.icons8.com/cotton/30/000000/tram--v6.png'
const busicon= 'https://img.icons8.com/office/16/000000/bus.png'
const trainicon= 'https://img.icons8.com/emoji/30/000000/train-emoji.png'
const lightrail='https://e7.pngegg.com/pngimages/722/807/png-clipart-tram-light-rail-in-sydney-transport-for-nsw-lilyfield-travel-miscellaneous-text-thumbnail.png' 


//Initial variables 
  let iconlist=[tramicons,tramicons,trainicon]
  let markers=[]

//First iteration
  //From emitting event (spawn), api data is extracted from api call and triggers (tram) event which sends the data to the index.html side
  socket.emit('spawn')//Activating API call from ptnsw.py
  socket.once('data',function(data){
    //Looping each type of vehicle
    for(let i=0;i<data.length;i++){
    //Initial variable for that vehicle 
    let markerstemp=[]
    //Extracting coordinate and route data
    let latitude=data[i][0]
    let longitude=data[i][1]
    let routeid=data[i][2]
    //Looping for each individual vehicle in that vehicle type
      for(let j=0;j<routeid.length;j++){
        //Converting coordinates into google compatible coordinates
        let myLngLat=new mapboxgl.LngLat(longitude[j],latitude[j])
        //Creating info window(DO THIS PART)
        
        //Creating the marker
        let marker=new mapboxgl.Marker({})
        marker.setLngLat(myLngLat)
        marker.addTo(map)
      //Pushing marker in temporary array to segregate vehicle types   
      markerstemp.push(marker) 
      }
      //Pushing array in overall marker array
      markers.push(markerstemp)
    } 
  })

  //Updating function 
  function replaceMarkers(markers){
    //Repeating api data retrieval process by doing the same event calling 
    socket.emit('spawn')//Activating API call from ptnsw.py
    socket.on('data',function(data){//From emitting event (spawn) event (tram) is triggered) 
    //Looping for each vehicle type 
    for(let i=0;i<data.length;i++){
        //console.log(coordinates)//Testing if coordinates are present 
        //Extracting coordinates
        let latitude=data[i][0]
        let longitude=data[i][1]
        
        //Looping for each individual vehicle 
        for(let j=0;j<latitude.length;j++){//Creating all the markers
            //Converting coordinates into google compatible coordinates 
            let myLngLat=new mapboxgl.LngLat(longitude[j],latitude[j])
            //Extracting vehicle type array from the master marker array
             let markersub=markers[i]
            //Setting and changing to the new position of that vehicle
             markersub[j].setLngLat(myLngLat)
             } 
        }
    
    })
  }

  //Repeating the update function for continous updates 
  try{
  setInterval(replaceMarkers,2000,markers)
  }
catch(e){
  console.log(e)
 setInterval(replaceMarkers,2000,markers)
}