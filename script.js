import 'ol';
import 'ol/ol.css';
import {fromLonLat} from 'ol/proj';

var olview = new ol.View({
    center: [-13615134.70, 6050027.15], // Red Square coordinates
    zoom: 16,
    maxZoom: 20
});

var sourceFeatures = new ol.source.Vector(),
    layerFeatures = new ol.layer.Vector({source: sourceFeatures});

var map = new ol.Map({
    target: document.getElementById('map'),
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    view: olview,
    renderer: 'canvas',
    layers: [
      new ol.layer.Tile({
        style: 'Aerial',
        source: new ol.source.OSM()
      }),
      layerFeatures
    ]	
});

var popup = new ol.Overlay.Popup;
popup.setOffset([0, -40]);
map.addOverlay(popup);

var popupStyle = [
    new ol.style.Style({
        image: new ol.style.Icon(({
            scale: 0.7,
            rotateWithView: false,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            opacity: 1,
            src: '//raw.githubusercontent.com/sonyalao/microwave/master/Images/microwave.png'
        })),
        zIndex: 5
    }),
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,1)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0,0,0,1)'
            })
        })
    })
];

var microwaveLocs = {"locations":[
    {
      "name": "By George Cafe",
      "coordinates": [-122.310445, 47.656652],
      "description": "Busy around lunch time"
    },
    {
      "name": "HUB basement",
      "coordinates": [-122.305085, 47.655512],
      "description": "Husky Den area"
    },
    {
        "name": "HUB 1st floor", 
        "coordinates": [-122.304838, 47.655541],
        "description": "Notes: Starbucks wing"
    },
    {
        "name": "Gowen Hall", 
        "coordinates": [-122.307756, 47.656603],
        "description": "3rd floor in the East Asia library lounge"
    },
    {
        "name": "Rotunda at Magnuson Health Sciences",
        "coordinates": [-122.310425, 47.651172],
        "description": "Notes: can be crowded"
    },
    {
        "name": "Loew Hall",
        "coordinates": [-122.304485, 47.654418],
        "description": "3rd floor of Loew, take a right at the stairs and break room on the right"
    },
    {
        "name": "South Campus Center",
        "coordinates": [-122.310910, 47.649615],
        "description": "Where the now-defunct cafe once was"
    },
    {
        "name": "Hutchinson Hall",
        "coordinates": [47.659788, -122.306558],
        "description": "Microwave located in the lounge area"
    }
  ]};
  
  for (var i = 0; i < microwaveLocs.locations.length; i++) {
      var feature = new ol.Feature({
          type: 'click',
          name: microwaveLocs.locations[i].name,
          desc: microwaveLocs.locations[i].description,
          geometry: new ol.geom.Point(fromLonLat([microwaveLocs.locations[i].coordinates[0], microwaveLocs.locations[i].coordinates[1]]))
      });
      feature.setStyle(popupStyle);
      sourceFeatures.addFeature(feature);
  }

function validateForm(){
	var building = document.forms["addBuilding"]["buildingname"].value;
	var description = document.forms["addBuilding"]["description"].value;
	var loc = document.forms["addBuilding"]["location"].value;
	alert("this worked");
}

map.on('click', function(evt) {
    var f = map.forEachFeatureAtPixel(
        evt.pixel,
        function(ft, layer){return ft;}
    );
    if (f && f.get('type') == 'click') {
        var geometry = f.getGeometry();
        var coord = geometry.getCoordinates();
        
        var content = '<p> Location: '+f.get('name')+'<br> Notes: '+f.get('desc')+'</p>';
        
        popup.show(coord, content);
        
    } else { popup.hide(); }
    
});
map.on('pointermove', function(e) {
    if (e.dragging) { popup.hide(); return; }
    
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

