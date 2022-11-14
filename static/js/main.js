
let map;



function initMap() {
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:-33.8836784362793 , lng: 151.20750427246094},
    zoom: 14,
    mapId: '5c34562cb4a2c954',
    tilt: 45,
    heading:180
  });
  
  const transitLayer = new google.maps.TransitLayer();

  transitLayer.setMap(map);
  // Create a WebGL Overlay View instance.
const webglOverlayView = new google.maps.WebGLOverlayView();

// Add the overlay to the map.
webglOverlayView.setMap(map);
}
