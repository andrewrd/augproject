//Google API Key, for development purposes all localmachines are allowed. Change this in production.
var API_KEY = 'AIzaSyAsJGvBskayVLIScXlb9WeCAypC9wGUf40';
//retrieves the audio element id
var audio = document.getElementById("notification-sound");
//sets audio to muted by default
audio.muted = true;
//retrieves mute button id
var start = document.getElementById("start");
var augInfo = document.getElementById("augInfo");
var soundButton = document.getElementById("sound-toggle");
var foundLocationNames = [];
var foundStatues = [];

var noSleep = new NoSleep();

expiry = new Date();
//Date format = Days/hours/minutes/seconds/milliseconds
//Sets expiry to 10 days from creation
expiry.setTime(expiry.getTime() + (10 * 24 * 60 * 60 * 1000));
//Initialises the project location to macquarie university
var myLatLng = {
    lat: 33.7738,
    lng: 151.1126
};

function checkCookie() {
    if (document.cookie.indexOf("foundLocations") >= 0) {
        foundLocationNames = getCookie("foundLocations").split(",");
        console.log(foundLocationNames);
    } else {
        document.cookie = "foundLocations=; expires=" + expiry.toGMTString();
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//saves array into cookie
function saveCookie(saveArray) {
    var cookieString = saveArray.join();
    document.cookie = "foundLocations=" + cookieString + "; expires=" + expiry.toGMTString();
}


//checks that a cookie exists.
checkCookie();

//removes all found locations from the statue array, adds them to the foundStatues array
function removeFound(foundLocs, target, foundStatues) {
    for (var i = 0; i < foundLocs.length; i++) {
        for (var k = 0; k < target.length; k++) {
            if (foundLocs[i] == target[k].name) {
                foundStatues.push(target[k]);
                removeStatue(target, k);
            }
        }
    }
}

//removes the statue at targetIndex from the targetArray
function removeStatue(targetArray, targetIndex) {
    targetArray.splice(targetIndex, 1);
}

removeFound(foundLocationNames, statues, foundStatues);

//toggle for the mute button on header
soundButton.onclick = function toggleSound() {
    if (audio.muted) {
        audio.muted = false;
        audio.load();
        this.innerHTML = "MUTE";
    } else {
        audio.muted = true;
        this.innerHTML = "UNMUTE";
    }
}

//Starts the loading of the map and enables sound
start.onclick = function startSound() {
    if (audio.muted) {
        watchUserLocation(location);
        document.getElementById("splash").style.display = "none";
        audio.muted = false;
        audio.load();
        noSleep.enable();
        document.getElementById("sound-toggle").style.display = "inline";
    }
}

//displays instructions for the user
augInfo.onclick = function toggleInstructions() {
  document.getElementById("splash").getElementsByTagName("p")[0].style.display = "block";
}

//displays a nice noty notification at top of screen
function notyMessage(statue) {
    $.noty.defaults.killer = true; //closes existing notys
    noty({
        text: 'Congratulations, you found <span class = "emph">' + statue.name + '</span>. <span class = "close">X</span> ',
        layout: 'topCenter',
        closeWith: ['click'],
        type: 'success'
    });
}

//Outputs notification text
function notifyUser(notificationTitle, notificationMessage, notificationImage) {
    document.getElementById("notification-title").innerHTML = notificationTitle;
    document.getElementById("notification-message").innerHTML = notificationMessage;
    document.getElementById("notification-image").innerHTML = "";
    document.getElementById("notification-image").appendChild(notificationImage);
}

//Fills out the info card  with the statue name, and description
function displayInfo(theSculpture) {
    var theName = theSculpture.name;
    var theDesc = theSculpture.description;
    var theYear = theSculpture.year;
    document.getElementById("location-container").getElementsByTagName('h3')[0].innerHTML = theName;
    document.getElementById("location-container").getElementsByTagName("p")[0].innerHTML = theYear;
    document.getElementById("location-container").getElementsByTagName("p")[1].innerHTML = theDesc;
    document.getElementById("location-container").style.display = "block";
}

//Location object to store location values in
function location(lat, longi) {
    this.latitude = lat;
    this.longitude = longi;
}

//Helper function to convert degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

//Checks distance between 2 gps locations.
//https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
function checkDistance(gps1, gps2) {
    var R = 6378137; //Radius in metres
    var distLat = toRad(gps2.latitude - gps1.latitude);
    var distLong = toRad(gps2.longitude - gps1.longitude);
    var lat1 = toRad(gps1.latitude);
    var lat2 = toRad(gps2.latitude);


    var a = Math.sin(distLat / 2) * Math.sin(distLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(distLong / 2) * Math.sin(distLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;
    console.log("You are " + distance + "m away from this target");
    return distance; //Returns distance in metres
}


function CustomMarker(latlng, map, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
}

CustomMarker.prototype = new google.maps.OverlayView();


CustomMarker.prototype.draw = function () {


    var self = this;

    var div = this.div;


    if (!div) {

        div = this.div = document.createElement('nav');
        div.className = 'circular-menu';

        var circleDiv = document.createElement('div');
        circleDiv.className = 'circle';

        var firstLink = document.createElement('a');
        firstLink.className = "fa fa-home fa-2x";
        firstLink.href = "#";

        var secondLink = document.createElement('a');
        secondLink.className = "fa fa-home fa-2x";
        secondLink.setAttribute("id", "tests");
        secondLink.href = "#animatedModal";


        circleDiv.appendChild(firstLink);
        circleDiv.appendChild(secondLink);
        div.appendChild(circleDiv);

        var menuLink = document.createElement('a');

        menuLink.className = "menu-button fa fa-bars fa-2x";

        div.appendChild(menuLink);
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';

        if (typeof (self.args.marker_id) !== 'undefined') {
            div.dataset.marker_id = self.args.marker_id;
        }

        google.maps.event.addDomListener(div, "click", function (event) {
            var items = div.querySelectorAll('.circle a');

            for (var i = 0, l = items.length; i < l; i++) {
                items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";

                items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            }

            document.querySelector('.menu-button').onclick = function (e) {
                e.preventDefault();
                document.querySelector('.circle').classList.toggle('open');
            }

        })

        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);



    }

    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

    //Offset the icon by half its size... .Magic number. 
    if (point) {
        div.style.left = (point.x - 125) + 'px';
        div.style.top = (point.y - 125) + 'px';
    }

}




CustomMarker.prototype.remove = function () {
    if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
    }

}


CustomMarker.prototype.getPosition = function () {
    return this.latlng;
}


//Draws a googlemap showing location upon function call
function initMap() {


    var testLoc = new google.maps.LatLng(-33.7797342, 151.2847516);
    
    var mapOptions = {

        zoom: 20,
        center: myLatLng,
        styles: [
            {
                "featureType": "landscape",
                "stylers": [
                    {
                        "hue": "#FFBB00"
                    },
                    {
                        "saturation": 43.400000000000006
                    },
                    {
                        "lightness": 37.599999999999994
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "stylers": [
                    {
                        "hue": "#FFC200"
                    },
                    {
                        "saturation": -61.8
                    },
                    {
                        "lightness": 45.599999999999994
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "stylers": [
                    {
                        "hue": "#FF0300"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 51.19999999999999
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [
                    {
                        "hue": "#FF0300"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 52
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "water",
                "stylers": [
                    {
                        "hue": "#0078FF"
                    },
                    {
                        "saturation": -13.200000000000003
                    },
                    {
                        "lightness": 2.4000000000000057
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "hue": "#00FF6A"
                    },
                    {
                        "saturation": -1.0989010989011234
                    },
                    {
                        "lightness": 11.200000000000017
                    },
                    {
                        "gamma": 1
                    }
                ]
            }
        ]
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    overlay = new CustomMarker(
        testLoc,
        map, {
            marker_id: '123'
        }
    );
    
    
    map.setTilt(20);
    //   
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'This is you!'
    });


}
google.maps.event.addDomListener(window, 'load', initMap);



//Gets the users location using HTML5 geolocation, takes and watches if the target is near
//Takes location object as input
function watchUserLocation(location) {

    if (!navigator.geolocation) {
        notifyUser("Something went wrong!", "<p>Geolocation is not supported by your browser.</p>", "");
        return;
    }
    var id, options;
    //Wakelock does not work, causes code to crash
    //var wakeLock;

    function success(pos) {
        var crd = pos.coords;
        var currentLoc = new location(crd.latitude, crd.longitude);
        var img = new Image();
        //img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + crd.latitude + "," + crd.longitude + "&zoom=17&size=300x300&sensor=false&key=" + API_KEY;

        var locationOutput = '<p>Latitude is ' + currentLoc.latitude + '° <br>Longitude is ' + currentLoc.longitude + '°</p>';

        notifyUser("Located!", locationOutput, img);


        myLatLng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };
        initMap();

        //Check current location against the statues array
        for (var i = 0; i < statues.length; i++) {
            var target = new location(statues[i].latitude, statues[i].longitude);
            if (checkDistance(currentLoc, target) < 10) {
                notyMessage(statues[i]);
                console.log('Congratulations, you are within 10m from the target');
                audio.play();
                displayInfo(statues[i]);
                //add found locations name to array
                foundLocationNames.push(statues[i].name)
                    //add found locations to foundStatues, and remove from statues
                removeFound(foundLocationNames, statues, foundStatues);
                //saves cookie each time a location is found
                saveCookie(foundLocationNames);
            }
        }

    }

    function error(err) {
        notifyUser("Something went wrong!", "<p>We were unable to locate you.</p>", "");
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    options = { 
        enableHighAccuracy: true,
         timeout: 5000,
         maximumAge: 0
    };
    //wakeLock = window.navigator.requestWakeLock('gps');
    id = navigator.geolocation.watchPosition(success, error, options);
}



watchUserLocation(location);

//Selection for generated content. 
$(document).on('click', 'a#tests', function (event) {
    //    event.preventDefault();
    alert("It's Working");
    $("#demo01").animatedModal();

})
$("#demo01").animatedModal();


