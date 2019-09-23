import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/geom/Point.js';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: ol.proj.fromLonLat([-74.006,40.7127]),
    zoom: 17
  })
});

	
/*var baseMapLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});
var map = new ol.Map({
  target: 'map',
  layers: [ baseMapLayer],
  view: new ol.View({
          center: ol.proj.fromLonLat([-74.0061,40.712]), 
          zoom: 7 //Initial Zoom Level
        })
	
});	*/

//Adding a marker on the map
var marker = new Feature({
  geometry: new Point(
    ol.proj.fromLonLat([-74.006,40.7127])
  ),  // Cordinates of New York's Town Hall
});
/*var vectorSource = new ol.source.Vector({
  features: [marker]
});*/
var markerVectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
	features: [marker]
  })
});
map.addLayer(markerVectorLayer);	
	
