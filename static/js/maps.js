//Map settings 

//Mapbox API key (PUT HERE) 
mapboxgl.accessToken = 'pk.eyJ1IjoianRheTAwNTEiLCJhIjoiY2xhdjBnZXVtMDEzejNubG1nZ21hN3VjMiJ9.H7P1__12c75cLxmNEj6Zug';
//Making origin in NSW CBD
let origin=[151.20750427246094,-33.8836784362793,0]
//Creating and setting the map 
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: origin, // starting position [lng, lat]
    zoom: 16 ,// starting zoom
    pitch: 60,
antialias: true // create the gl context with MSAA antialiasing, so custom layers are antialiased,
});





