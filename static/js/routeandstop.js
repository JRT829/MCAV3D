
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


            map.loadImage(
                'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                (error, image) => {
                if (error) throw error;
                map.addImage('custom-marker', image);
            map.addSource('cbdandsoutheaststops', {
                type: 'geojson',
                data: 'static/js/cbdandsoutheaststops.geojson'
                });
                map.addLayer({
                    'id': 'cbdandsoutheaststops',
                    'type': 'symbol',
                    'source': 'cbdandsoutheaststops',
                    'layout': {
                        'icon-image': 'custom-marker',
                        // get the title name from the source's "title" property
                        'text-field': ['get', 'title'],
                        'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top'
                    }
                    
                    });
                })

                map.loadImage(
                    'https://i.ibb.co/qx2kPJg/pngwing-com-1.png',
                    (error, image) => {
                    if (error) throw error;
                    map.addImage('custom-marker2', image);
                map.addSource('innerweststops', {
                    type: 'geojson',
                    data: 'static/js/innerweststops.geojson'
                    });
                    map.addLayer({
                        'id': 'innerweststops',
                        'type': 'symbol',
                        'source': 'innerweststops',
                        'layout': {
                            'icon-image': 'custom-marker2',
                            // get the title name from the source's "title" property
                            'text-field': ['get', 'title'],
                            'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                            ],
                            'text-offset': [0, 1.25],
                            'text-anchor': 'top'
                        }
                        
                        });
                    })
                   
                   

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