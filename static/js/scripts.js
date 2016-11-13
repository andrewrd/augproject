//Google API Key, for development purposes all localmachines are allowed. Change this in production.
var API_KEY = 'AIzaSyAsJGvBskayVLIScXlb9WeCAypC9wGUf40';
//retrieves the audio element id
var audio = document.getElementById("notification-sound");

//sets audio to muted by default
audio.muted = true;
//Initialises the project location to macquarie university
var myLatLng = {
    lat: 33.7738,
    lng: 151.1126
};

//Sends a get request to the user, should be a callback but update this when possible
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}



var checkRadius = 100;

var start = document.getElementById("start");
var augInfo = document.getElementById("augInfo");
var soundButton = document.getElementById("sound-toggle");
var userMarker = [];
var foundStatues = [];

var noSleep = new NoSleep();
//initialises noSleep which keeps the browser screen alive
//while the page is active

var map;
//initialises the map variable for global scoping of map features

expiry = new Date();
//Date format = Days/hours/minutes/seconds/milliseconds
//Sets expiry to 10 days from creation
expiry.setTime(expiry.getTime() + (10 * 24 * 60 * 60 * 1000));

//Returns an array of location names that have been found
var foundLocationNames = checkCookie('foundLocations');
//based on found location names, returns an array of found statue objects
foundStatues = removeFound(foundLocationNames, statues, foundStatues);
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
};


//Starts the loading of the map and enables sound
start.onclick = function startSound() {
    if (audio.muted) {
        watchUserLocation(location);
        document.getElementById("splash").style.display = "none";
        audio.muted = false;
        audio.load();
        document.getElementById("map-container").style.visibility = "visible";
        noSleep.enable();
        document.getElementById("sound-toggle").style.display = "inline";
        document.body.style.overflow = "scroll";
        document.getElementById("overlay").style.display = "none";
    }
}

//displays instructions for the user
augInfo.onclick = function toggleInstructions() {
  document.getElementById("splash").getElementsByTagName("p")[0].style.display = "block";
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
    console.log(gps2);
    console.log(gps1);
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

//custom map marker constructor
function CustomMarker(latlng, map, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
}

//sets the overlayview that custom marker displays over
CustomMarker.prototype = new google.maps.OverlayView();

//function deals with how custom markers are drawn
CustomMarker.prototype.draw = function () {


    var self = this;

    var div = this.div;


    if (!div) {

        div = this.div = document.createElement('nav');
        div.className = 'circular-menu';

        var circleDiv = document.createElement('div');
        circleDiv.className = 'circle';

        var firstLink = document.createElement('a');
        firstLink.className = "fa fa-info-circle fa-2x callInfo";
        firstLink.href = "#";

        var secondLink = document.createElement('a');
        secondLink.className = "fa fa-eye fa-2x callObj";
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

            var items = this.querySelectorAll('.circle a');

            for (var i = 0, l = items.length; i < l; i++) {
                items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";

                items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            }

            this.querySelector('.menu-button').onclick = function (e) {
                e.preventDefault();
                this.parentNode.querySelector('.circle').classList.toggle('open');
            }

            this.querySelector('.callObj').onclick = function(e) {
              e.preventDefault();
              $('.callObj').animatedModal();
              $("#animatedModal").removeClass("animatedModal-off").addClass("animatedModal-on").css({
                "opacity": "1",
                "z-index": "9999"
              })
            }

            this.querySelector('.callInfo').onclick = function(e) {
              e.preventDefault();
              var targetId = self.args.marker_id;
              locationDisplay(targetId);
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



//function to remove custom markers from the map
CustomMarker.prototype.remove = function () {
    if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
    }

}

//get the position of the custom marker
CustomMarker.prototype.getPosition = function () {
    return this.latlng;
}

//initialises the custom marker once the page loads
google.maps.event.addDomListener(window, 'load', function() {map = initMap(foundStatues);});


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

//        var locationOutput = '<p>Latitude is ' + currentLoc.latitude + '° <br>Longitude is ' + currentLoc.longitude + '°</p>';

//        notifyUser("Located!", locationOutput, img);
        console.log("Your location is Latitude: " + currentLoc.latitude+", Longitude: "+ currentLoc.longitude)
        document.getElementById("notification-container").style.display = "none";

        myLatLng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        //centre the map on the users location
        map.panTo(myLatLng);

        //this removes old user positon from the map
        for (var i = 0; i < userMarker.length; i++) {
          userMarker[i].setMap(null);
        }

        //clears the array of old user markers, as we dont need
        //these once theyve been removed
        userMarker = [];

        //creates a marker on the map at the users location
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: 'img/person-icon-2.png'
        });

        //stores this new marker in a global array,
        //so it can be accessed anywhere
        userMarker.push(marker);


        //Check current location against the statues array
        for (var i = 0; i < statues.length; i++) {
            var target = new location(statues[i].latitude, statues[i].longitude);
            if (checkDistance(currentLoc, target) < checkRadius) {
                var markerID = statues[i].id;

                //Question code, may bug if near two statues at once, test this.
                var question = statues[i].question;
                var answer = statues[i].answer;

                $(".question").fadeIn();
                document.getElementById("answer").innerHTML = question;

                console.log(question);

                $("#true").click(function() {
                    $("#true").hide();
                    $("#false").hide();

                    if("T"==answer){
                        document.getElementById("answer").innerHTML = 'You chose correctly!';
                    } else {
                        document.getElementById("answer").innerHTML = 'You chose WRONG!';

                    }
                    $(".question").fadeOut(5000);
                });

                $("#false").click(function() {
                    $("#true").hide();
                    $("#false").hide();

                    if("F"==answer) {
                        document.getElementById("answer").innerHTML = 'You chose wrong!';
                    } else {
                        document.getElementById("answer").innerHTML = 'You chose WRONG!';

                    }

                    $(".question").fadeOut(5000);
                });

                //Noty launch section, triggers noty dependency
                notyMessage(statues[i]);
                console.log('Congratulations, you are within 10m from the target');
                audio.play();
                displayInfo(statues[i]);
                //add found locations name to array
                foundLocationNames.push(statues[i].name);
                //add found locations to foundStatues, and remove from statues
                foundStatues = removeFound(foundLocationNames, statues, foundStatues);
                //saves cookie each time a location is found
                saveCookie('foundLocations', foundLocationNames);
                //adds found locations to foundLocations menu
                updateFoundOverlay();
                //printLocsMenu(foundStatues);

                //creates a google maps LatLng object

                var markerPos = new google.maps.LatLng(target.latitude, target.longitude);
                overlay = new CustomMarker(
                    markerPos,
                    map, {
                        marker_id: markerID
                    }
                );
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
    //Figure out whether to use this or remove. This wakes the GPS and keeps it on.
    //wakeLock = window.navigator.requestWakeLock('gps');
    id = navigator.geolocation.watchPosition(success, error, options);
}

//animates the expand & collapsing of mobile menu
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
      x.className += " responsive";
  } else {
      x.className = "topnav";
  }
}

//opens and closes the found locations overlay screen
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

//adds the found locations onto the FoundLocations menu overlay
function populateFoundOverlay() {
  for (var i = foundStatues.length-1; i >= 0; i--) {
    var foundStatueName = foundStatues[i].name;
    var foundStatueID = foundStatues[i].id;
    $( ".overlay-content" ).append("<div class = 'overlayStatueName'>" + foundStatueName + "</div>");
    $( ".overlay-content" ).append("<a href='#' class = 'statueMenuItem'><div class = 'menuItem statueItem' id = '" +foundStatueID+ "'>Statue Info.</div></a>");
    $( ".overlay-content" ).append("<a href='#animatedModal' class = 'artifactMenuItem'><div class = 'menuItem'>View Artifact</div></a><br/>");
  }
  $('.statueItem').click(function() {
    locationDisplay($(this).attr('id'));
  });

  //opens artifact on foundLocations page
  $('.artifactMenuItem').click(function() {
    $(this).animatedModal();
  });
}

//
function updateFoundOverlay() {
  var foundStatueName = foundStatues[foundStatues.length-1].name;
  var foundStatueID = foundStatues[foundStatues.length-1].id;
  $( ".overlay-content" ).append("<div class = 'overlayStatueName'>" + foundStatueName + "</div>");
  $( ".overlay-content" ).append("<a href='#' class = 'statueMenuItem'><div class = 'menuItem statueItem' id = '" +foundStatueID+ "'>Statue Info.</div></a>");
  $( ".overlay-content" ).append("<a href='#animatedModal' class = 'artifactMenuItem'><div class = 'menuItem'>View Artifact</div></a><br/>");

  $('.statueItem').click(function() {
    locationDisplay($(this).attr('id'));
  });

  //opens artifact on foundLocations page
  $('.artifactMenuItem').click(function() {
    $(this).animatedModal();
  });
}

//grabs the id of the FoundLocations menuItem and directs to its information page

//Jquery dependency closes modal
$("#demo01").animatedModal();

//updates the found locations overlay if locations have been found
if (foundStatues.length != 0) {
  populateFoundOverlay();
}

$(".close-animatedModal").click(function(){
  $("#animatedModal").css({
    "opacity": "0",
    "z-index": "-9999"
  })
});

$(".question").hide();
