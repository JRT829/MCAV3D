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
  let model=[]
  let coord=[]
  let bear=[]
  let route=[]
  let colors=[0x660000,0x073763]
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
        'line-color': '#073763',
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
            'line-color': '#660000',
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
    let modeltemp=[]
    let routetemp=[]
    let coordtemp=[]
    let bearingtemp=[]
    //Extracting coordinate and route data
    let latitude=data[i][0]
    let longitude=data[i][1]
    let bearing=data[i][2]
    let routeid=data[i][3]
    //Looping for each individual vehicle in that vehicle type
      for(let j=0;j<routeid.length;j++){
        //Converting coordinates into google compatible coordinates
       
      //cube

      /*var geometry = new THREE.BoxGeometry(1, 1, 1);
      let cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: colors[i] }));
      cube = tb.Object3D({ obj: cube, units: 'meters' });
      let options={
        coords:[longitude[j],latitude[j]],
        rotation:[0,0,bearing[j]]
      }
      cube.set(options)
      cube.setCoords([longitude[j],latitude[j]]);*/
      sphereTemplate = tb.sphere(
        {
            radius: 0.5,
            units: 'meters',
            sides: 120,
            color: colors[i],
            material: 'MeshPhysicalMaterial'
        }
    )
      tb.add(sphereTemplate);
      

       
        
       
       
      //Pushing marker in temporary array to segregate vehicle types   
      
      modeltemp.push(sphereTemplate)
      coordtemp.push([longitude[j],latitude[j]])
      bearingtemp.push(bearing[j])
      routetemp.push(routeid[j])
      
      }
      //Pushing array in overall marker array
      
      model.push(modeltemp)
      coord.push(coordtemp)
      bear.push(bearingtemp)
      route.push(routetemp)
    } 
    console.log(model)
  })
      
    },
    render: function (gl, matrix) {
      tb.update(); //update Threebox scene
    }
  });

  // Insert the layer beneath any symbol layer.
const layers = map.getStyle().layers;
const labelLayerId = layers.find(
(layer) => layer.type === 'symbol' && layer.layout['text-field']
).id;
 
// The 'building' layer in the Mapbox Streets
// vector tileset contains building height data
// from OpenStreetMap.
map.addLayer(
{
'id': 'add-3d-buildings',
'source': 'composite',
'source-layer': 'building',
'filter': ['==', 'extrude', 'true'],
'type': 'fill-extrusion',
'minzoom': 15,
'paint': {
'fill-extrusion-color': '#aaa',
 
// Use an 'interpolate' expression to
// add a smooth transition effect to
// the buildings as the user zooms in.
'fill-extrusion-height': [
'interpolate',
['linear'],
['zoom'],
15,
0,
15.05,
['get', 'height']
],
'fill-extrusion-base': [
'interpolate',
['linear'],
['zoom'],
15,
0,
15.05,
['get', 'min_height']
],
'fill-extrusion-opacity': 0.6
}
},
labelLayerId
    );




})
//First iteration
  
 // INFO WINDO NOT WORKING
 map.on('click',(e)=>{
  // calculate objects intersecting the picking ray
  var intersect = tb.queryRenderedFeatures(e.point)[0]
  //console.log(intersect)
  if (typeof intersect.object =='object'){
    console.log(intersect.object)
    let clickedID=intersect.object.parent.uuid
    console.log(intersect.object.parent.uuid)
    for(let i=0;i<colors.length;i++){    
      
      //Looping for each individual vehicle 
      for(let j=0;j<model[i].length;j++){//Creating all the markers
            let modelID=model[i][j].uuid
            if(modelID==clickedID){
              console.log('the id is'+modelID)
              const popup = new mapboxgl.Popup({ closeOnClick: false })
                      .setLngLat(coord[i][j])
                      .setHTML('<h1>'+route[i][j]+'</h1>')
                      .addTo(map);
            }
          
           } 
      }
  }
  
 })


 


 
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
        let bearing=data[i][2]
        
        //Looping for each individual vehicle 
        for(let j=0;j<latitude.length;j++){//Creating all the markers
            //Converting coordinates into google compatible coordinates 
            
             
             let vehicle=model[i][j]
             let origin=coord[i][j]
             let destination=[longitude[j],latitude[j]]
             let initialbear=bear[i][j]
             let finalbear=bearing[j]
            if (destination==undefined||finalbear==undefined){
              destination=origin
              finalbear==initialbear
            }
            let options = {
              path: [origin,destination],
              duration: 3000,
              trackHeading:true
              
            }
            let cubeoptions={
              rotation:[0,0,finalbear]
            }
             model[i][j].followPath(options,function() {
              
              //model[i][j].set(cubeoptions)
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
  setInterval(replaceMarkers,3000,coord,model)
  }
catch(e){
  console.log(e)
 setInterval(replaceMarkers,3000,coord,model)
}