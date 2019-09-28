import 'ol';
//import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import Geolocation from 'ol/Geolocation.js';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';

var olview = new ol.View({
    center: [-13615134.70, 6050027.15], // Red Square coordinates
    zoom: 16,
    maxZoom: 20
});

var sourceFeatures = new ol.source.Vector(),
    layerFeatures = new ol.layer.Vector({ source: sourceFeatures });

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

var microwaveLocs = {
    "locations":
        [
            {
                "name": "By George Cafe",
                "coordinates": [-122.310445, 47.656652],
                "description": "Busy around lunch time"
            },
            {
                "name": "Husky Union Building (HUB) basement",
                "coordinates": [-122.305085, 47.655512],
                "description": "Husky Den area"
            },
            {
                "name": "Husky Union Building (HUB)",
                "coordinates": [-122.304838, 47.655541],
                "description": "Starbucks wing"
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
                "coordinates": [-122.306558, 47.659788],
                "description": "Microwave located in the lounge area"
            },
            {
                "name": "Fishery Sciences Building",
                "coordinates": [-122.316177, 47.653394],
                "description": ""
            },
            {
                "name": "Foege Hall",
                "coordinates": [-122.312820, 47.652455],
                "description": "Foege North has two microwaves in every floor. Although it is keyed access, many times the doors will be held open. Also, the BioE student lounge has two microwaves as well. Basically Foege is microwave heaven. I would only recommend if you have a BioE friend and you have class near there though."
            },
            {
                "name": "Bill and Melinda Gates Center for Computer Science and Engineering (CSE2)",
                "coordinates": [-122.305129, 47.653230],
                "description": "Located in undergrad commons. Keyed access for CSE undergrads only"
            }
        ]
};

var nHTML = ''; // inner HTML
for (var i = 0; i < microwaveLocs.locations.length; i++) {
    var feature = new ol.Feature({
        type: 'click',
        name: microwaveLocs.locations[i].name,
        desc: microwaveLocs.locations[i].description,
        geometry: new ol.geom.Point(fromLonLat([microwaveLocs.locations[i].coordinates[0], microwaveLocs.locations[i].coordinates[1]]))
    });
    feature.setStyle(popupStyle);
    sourceFeatures.addFeature(feature);
    nHTML += '<li> ' + microwaveLocs.locations[i].name + '</li>';
}
document.getElementById("locationList").innerHTML = '<ul>' + nHTML + '</ul>';

function validateForm() {
    var building = document.forms["addBuilding"]["buildingname"].value;
    var description = document.forms["addBuilding"]["description"].value;
    var loc = document.forms["addBuilding"]["location"].value;
    alert("this worked");
}

var geolocation = new ol.Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
        enableHighAccuracy: true
    },
    projection: olview.getProjection()
});

document.getElementById('track').addEventListener('change', function () {
    geolocation.setTracking(this.checked);
});


geolocation.on('change', function () {
    console.log('accuracy: ' + geolocation.getAccuracy() + ' [m]');
	console.log('position: ' + geolocation.getPosition() + ' [m]');
});


// handle geolocation error.
geolocation.on('error', function(error) {
  var info = document.getElementById('info');
  info.innerHTML = error.message;
  info.style.display = '';
});

var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function () {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

var positionFeature = new ol.Feature();
positionFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
            color: '#3399CC'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
        })
    })
}));

geolocation.on('change:position', function () {
    var coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ?
        new ol.geom.Point(coordinates) : null);
});

sourceFeatures.addFeature(accuracyFeature);
sourceFeatures.addFeature(positionFeature);

map.on('click', function (evt) {
    var f = map.forEachFeatureAtPixel(
        evt.pixel,
        function (ft, layer) { return ft; }
    );
    if (f && f.get('type') == 'click') {
        var geometry = f.getGeometry();
        var coord = geometry.getCoordinates();

        var content = '<p> <b> Location:</b> ' + f.get('name') + '<br> <b>Notes:</b> ' + f.get('desc') + '</p>';

        popup.show(coord, content);

    } else { popup.hide(); }

});
map.on('pointermove', function (e) {
    if (e.dragging) { popup.hide(); return; }

    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);

    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

