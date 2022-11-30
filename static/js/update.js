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
    map.addSource('innerwest', {
      type: 'geojson',
      data: 'static/js/innerwest.geojson'
      });
      map.addLayer({
        'id': 'innerwest',
        'type': 'line',
        'source': 'innerwest',
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#888',
        'line-width': 8
        }
        });
        map.addSource('cbdandsoutheast', {
          type: 'geojson',
          data: 'static/js/cbdandsoutheast.geojson'
          });
          map.addLayer({
            'id': 'cbdandsoutheast',
            'type': 'line',
            'source': 'cbdandsoutheast',
            'layout': {
            'line-join': 'round',
            'line-cap': 'round'
            },
            'paint': {
            'line-color': '#888',
            'line-width': 8
            }
            });
    


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
             
             let vehicle=model[i][j]
             let origin=coord[i][j]
             let destination=[longitude[j],latitude[j]]
             
            if (destination==undefined){
              destination=origin
            }
            let options = {
              path: [origin,destination],
              duration: 5000,
              
            }
             model[i][j].followPath(options,function() {
              tb.update();
            })
          
             //model[i][j].setCoords([longitude[j],latitude[j]])
             //tb.update()
             
             coord[i].splice(j,1,destination)
            
            
             } 
        }
    
    })
  }

  


  //Repeating the update function for continous updates 
  try{
  setInterval(replaceMarkers,5000,coord,model)
  }
catch(e){
  console.log(e)
 setInterval(replaceMarkers,5000,coord,model)
}