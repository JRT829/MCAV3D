//Initialising socket.IO server
let socket = io('http://localhost:5000');

//Accessing the map 
mapboxgl.accessToken = 'pk.eyJ1IjoianRheTAwNTEiLCJhIjoiY2xhdjBnZXVtMDEzejNubG1nZ21hN3VjMiJ9.H7P1__12c75cLxmNEj6Zug';

//Icons
const tramicons= 'https://img.icons8.com/cotton/30/000000/tram--v6.png'
const busicon= 'https://img.icons8.com/office/16/000000/bus.png'
const trainicon= 'https://img.icons8.com/emoji/30/000000/train-emoji.png'
const lightrail='https://e7.pngegg.com/pngimages/722/807/png-clipart-tram-light-rail-in-sydney-transport-for-nsw-lilyfield-travel-miscellaneous-text-thumbnail.png' 
const lightraillogo='https://i.ibb.co/qx2kPJg/pngwing-com-1.png'
const metrologo='https://i.ibb.co/qyPhHP3/Metro-Logo.png'

//Initial variables 
  //Empty variables
  let model=[]
  let coord=[]
  let stops=[]
  let route=[]
  //Preset variables(Change all of the variables if adding an extra/removing a vehicle type eg.trains)
  let iconlist=[tramicons,tramicons]
  let logolist=[lightraillogo,lightraillogo]
  let colors=[0x660000,0x073763]//Color for the objects 
  let vehicletype = ['Light Rail','Light Rail']

//Creating 3D environment 
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
    let modeltemp=[]
    let routetemp=[]
    let coordtemp=[]
    let stoptemp=[]
    //Extracting coordinate and route data
    let latitude=data[i][0]
    let longitude=data[i][1]
    let routeid=data[i][2]
    let stopid=data[i][3]
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
      routetemp.push(routeid[j])
      stoptemp.push(stopid[j])
      
      }
      //Pushing array in overall marker array
      
      model.push(modeltemp)
      coord.push(coordtemp)
      stops.push(stoptemp)
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




})
//First iteration
map.on('click', 'innerweststops', (e) => {
  // Copy coordinates array.
  const coordinates = e.features[0].geometry.coordinates.slice();
  const description = e.features[0].properties.stop_name;
   
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
   
  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(description)
  .addTo(map);
  });
  map.on('click', 'cbdandsoutheaststops', (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.stop_name;
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });
 // INFO WINDO NOT WORKING
 map.on('click',function(e){
  // calculate objects intersecting the picking ray
  
  console.log(e)
  //console.log(intersect)
  if ( tb.queryRenderedFeatures(e.point)[0].object != undefined){
    let intersect=tb.queryRenderedFeatures(e.point)[0]
    console.log(intersect.object)
    let clickedID=intersect.object.parent.uuid
    console.log(intersect.object.parent.uuid)
    for(let i=0;i<colors.length;i++){    
      
      //Looping for each individual vehicle 
      for(let j=0;j<model[i].length;j++){//Creating all the markers
            let modelID=model[i][j].uuid
            if(modelID==clickedID){
              console.log('the id is'+modelID)
              socket.emit('stop',stops[i][j])
              let popup = new mapboxgl.Popup({ closeOnClick: true })
                      .setLngLat(coord[i][j])
              socket.once('stopcall',function(station){
              
                      popup.setHTML('<h3 id="firstHeading" class="firstHeading">'+String(vehicletype[i])+' to: '+station+' </h3>' +
                      '<div id="bodyContent">' +
                      '<p>Route ID: '+String(route[i][j])+' </p>' +
                      '<p>Coordinates: '+String(coord[i][j][0])+' , '+String(coord[i][j][1])+' </p>' +
                      '<img src= '+logolist[i]+">" )
                     

                      
              })
              popup.addTo(map);
              
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
        
        //Extracting coordinates
        let latitude=data[i][0]
        let longitude=data[i][1]

        //Looping for each individual vehicle 
        for(let j=0;j<latitude.length;j++){//Creating all the markers
            
             //Retrieving vehicle, their previous coordinates and their new updated coordinates 
             let vehicle=model[i][j]
             let origin=coord[i][j]
             let destination=[longitude[j],latitude[j]]

            // Sometimes the api gives some undefined data so we just ignore it and reuse the last coordinates that were received
            if (destination==undefined){
              destination=origin
            }

            //Setting animation properties
            let options = {
              path: [origin,destination],
              duration: 3000,//Length of animation
              trackHeading:true//Object to orient itself in the direction of the path(more usable for cubes since spheres have no effect when rotated along the z plane)
            }

            //Executing the animation 
             model[i][j].followPath(options,function() {
            //Updating the 3D scene
              tb.update();
            })
          
             //Updating the new coordinations into the master coordinate array
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
    console.log(e)//Making the code continue regardless of error 
    setInterval(replaceMarkers,3000,coord,model)
  }