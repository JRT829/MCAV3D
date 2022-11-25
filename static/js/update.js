//Initialising socket.IO server
let socket = io('http://localhost:5000');

mapboxgl.accessToken = 'pk.eyJ1IjoianRheTAwNTEiLCJhIjoiY2xhdjBnZXVtMDEzejNubG1nZ21hN3VjMiJ9.H7P1__12c75cLxmNEj6Zug';

//Icons
const tramicons= 'https://img.icons8.com/cotton/30/000000/tram--v6.png'
const busicon= 'https://img.icons8.com/office/16/000000/bus.png'
const trainicon= 'https://img.icons8.com/emoji/30/000000/train-emoji.png'
const lightrail='https://e7.pngegg.com/pngimages/722/807/png-clipart-tram-light-rail-in-sydney-transport-for-nsw-lilyfield-travel-miscellaneous-text-thumbnail.png' 


//Initial variables 
  let iconlist=[tramicons,tramicons]
  let markers=[]
  let model=[]
  let coord=[]
  window.tb = new Threebox(
    map,
    map.getCanvas().getContext('webgl'), //get the context from the map canvas
    { defaultLights: true }
  );
  map.on('style.load', function() {
  map.addLayer({
    id: 'custom_layer',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map, gl) {
      socket.emit('spawn')//Activating API call from ptnsw.py
  socket.once('data',function(data){
    //Looping each type of vehicle
    for(let i=0;i<data.length;i++){
    //Initial variable for that vehicle 
    let markerstemp=[]
    let modeltemp=[]
    let coordtemp=[]
    //Extracting coordinate and route data
    let latitude=data[i][0]
    let longitude=data[i][1]
    let routeid=data[i][2]
    //Looping for each individual vehicle in that vehicle type
      for(let j=0;j<routeid.length;j++){
        //Converting coordinates into google compatible coordinates
        let myLngLat=new mapboxgl.LngLat(longitude[j],latitude[j])
        var geometry = new THREE.BoxGeometry(30, 30, 30);
      let cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x660000 }));
      cube = tb.Object3D({ obj: cube, units: 'meters' });
      cube.setCoords([longitude[j],latitude[j]]);
      tb.add(cube);

       
        
       
       
      //Pushing marker in temporary array to segregate vehicle types   
      
      modeltemp.push(cube)
      coordtemp.push([longitude[j],latitude[j]])
      
      }
      //Pushing array in overall marker array
      
      model.push(modeltemp)
      coord.push(coordtemp)
    } 
    console.log(model)
  })
      
    },
    render: function (gl, matrix) {
      tb.update(); //update Threebox scene
    }
  });
})
//First iteration
  //From emitting event (spawn), api data is extracted from api call and triggers (tram) event which sends the data to the index.html side
  

  //Updating function 
  function replaceMarkers(coord,model){
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
             
             vehicle=model[i][j]
             origin=coord[i][j]
             destination=[longitude[j],latitude[j]]
             /*if(destination==undefined){
              destination=origin
              travelPath(origin,destination,vehicle) 
             }else{
             travelPath(origin,destination,vehicle) 
             }*/
             model[i][j].setCoords([longitude[j],latitude[j]])
             tb.update()
             
            
            //requestAnimationFrame(markersub[j].setLngLat(myLngLat));
             } 
        }
    
    })
  }

  function travelPath(origin,destination,vehicle){

    // request directions. See https://docs.mapbox.com/api/navigation/#directions for details

    var url = "https://api.mapbox.com/directions/v5/mapbox/driving/"+[origin, destination].join(';')+"?geometries=geojson&access_token=" + mapboxgl.accessToken


    fetchFunction(url, function(data){

      // extract path geometry from callback geojson, and set duration of travel
      var options = {
        path: data.routes[0].geometry.coordinates,
        duration: 2000
      }

      // start the truck animation with above options, and remove the line when animation ends
      vehicle.followPath(
        options,
      );

      // set destination as the new origin, for the next trip
      tb.update();

    })
  }
  
  //convenience function for fetch

  function fetchFunction(url, cb) {
    fetch(url)
      .then(
        function(response){
          if (response.status === 200) {
            response.json()
              .then(function(data){
                data//cb(data) works for like a second before going haywire
              })
          }
        }
      )
  }

  //Repeating the update function for continous updates 
  try{
  setInterval(replaceMarkers,5000,coord,model)
  }
catch(e){
  console.log(e)
 setInterval(replaceMarkers,5000,coord,model)
}