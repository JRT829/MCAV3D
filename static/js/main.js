
let map;



function initMap() {
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:-33.8836784362793 , lng: 151.20750427246094},
    zoom: 14
  });
  
  const transitLayer = new google.maps.TransitLayer();

  transitLayer.setMap(map);
}
