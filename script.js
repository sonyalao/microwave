import 'ol/ol.css';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
var olview = new ol.View({
    center: [-13615134.70, 6050027.15],
    resolution: 39135.75848201024,
    minZoom: 16,
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

var long_string = 'long text';


var style1 = [
    new ol.style.Style({
        image: new ol.style.Icon(({
            scale: 0.7,
            rotateWithView: false,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            opacity: 1,
            src: '//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
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

var feature = new ol.Feature({
    type: 'click',
    desc: long_string,
    geometry: new ol.geom.Point([-13615401.54, 6049803.54])
});
var feature2 = new ol.Feature({
    type: 'click',
    desc: "Hello",
    geometry: new ol.geom.Point([-13615134.70, 6050027.15])
});
feature.setStyle(style1);
sourceFeatures.addFeature(feature);

feature2.setStyle(style1);
sourceFeatures.addFeature(feature2);
var feature3 = new ol.Feature({
    type: 'click',
    desc: "I'm from a button click!!",
    geometry: new ol.geom.Point(fromLonLat([-122.308392, 47.6573088]))
});
feature3.setStyle(style1);
sourceFeatures.addFeature(feature3);


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
        
        var content = '<p>'+f.get('desc')+'</p>';
        
        popup.show(coord, content);
        
    } else { popup.hide(); }
    
});
map.on('pointermove', function(e) {
    if (e.dragging) { popup.hide(); return; }
    
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

