let map;
coord_temp= document.getElementById('data').innerHTML
coordinates=JSON.parse(coord_temp)
console.log(coordinates)
let latitude=coordinates[0]
let longitude=coordinates[1]
function initMap() {
  let latitude=coordinates[0]
 let longitude=coordinates[1]
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:-33.8836784362793 , lng: 151.20750427246094},
    zoom: 14
  });
  for(let i=0;i<latitude.length;i++){
    new google.maps.Marker({
      position: {lat: latitude[i], lng: longitude[i]},
      map: map,
      title: '{[i]}'
    });
  }

  
}

