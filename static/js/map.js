
mapboxgl.accessToken = 'pk.eyJ1IjoianRheTAwNTEiLCJhIjoiY2xhdjBnZXVtMDEzejNubG1nZ21hN3VjMiJ9.H7P1__12c75cLxmNEj6Zug';
let origin=[151.20750427246094,-33.8836784362793,0]
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: origin, // starting position [lng, lat]
    zoom: 16 ,// starting zoom
    pitch: 60,
antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased,
});

map.on('style.load', function() {

    map.addLayer({
        id: 'custom_layer',
        type: 'custom',
        onAdd: function(map, mbxContext){
    
            window.tb = new Threebox(
                map, 
                mbxContext,
                {defaultLights: true}
            );
            
    
            //instantiate a red sphere and position it at the origin lnglat
            var sphere = tb.sphere({color: 'red', material: 'MeshStandardMaterial'})
                .setCoords(origin);
    
            // add sphere to the scene
            tb.add(sphere);
    
        },
        
        render: function(gl, matrix){
            tb.update();
        }
    })
    });


//[-33.8836784362793 , 151.20750427246094],

