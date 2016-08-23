//Outputs location information
var e8cSculpture = new statue("Statue of Livertree", "A statue made out of livertres", -33.7743051, 151.1155864); //real coords
var libStatue = new statue("Two Huggers", "two statues hugging with no clothes on", -33.7746828, 151.1139948); //real coords

var audio = document.getElementById("notification-sound");
audio.muted = true;
var soundButton = document.getElementById("sound-toggle");
soundButton.onclick = toggleSound();

//Mutes and unmutes the notification sound
function toggleSound() {
	if (audio.muted) {
		audio.muted = false;
		//audio.play and audio.pause are requied in order for sound to work on mobile
		audio.play();
		audio.pause();
		this.innerHTML = "MUTE";
	} else {
		audio.muted = true;
		this.innerHTML = "UNMUTE";
	}
}

var neighbour = new statue("JD Neighbour", "JD's neighbour's house", -33.7474206, 150.8278817); //real coords


var API_KEY = 'AIzaSyCNK44iJbw19tdl9VUZqKeGsKROIDeQZzY';

//Outputs notification text
function notifyUser(notificationTitle, notificationMessage, notificationImage){
	document.getElementById("notification-title").innerHTML = notificationTitle;
	document.getElementById("notification-message").innerHTML = notificationMessage;
	document.getElementById("notification-image").innerHTML = "";
	//document.getElementById("notification-image").appendChild(notificationImage);
}

//Fills out the info card  with the statue name, and description
function displayInfo(theSculpture) {
	var theName = theSculpture.name;
	var theDesc = theSculpture.description;
	document.getElementById("location-container").getElementsByTagName('h3')[0].innerHTML = theName;
	document.getElementsByTagName("p")[0].innerHTML = theName;
	document.getElementsByTagName("p")[1].innerHTML = theDesc;
	document.getElementById("location-container").style.display = "block";
}

//Location object to store location values in
function location(lat, longi){
	this.latitude = lat;
	this.longitude = longi;
}

//statue object to store statues in
function statue(name, desc, lat, longi) {
	this.name = name;
	this.description = desc;
	this.latitude = lat;
	this.longitude = longi;
}
//array of statue objects
var statues = new Array(e8cSculpture,libStatue, neighbour);

//displayInfo(statues[0]);

//Helper function to convert degrees to radians
function toRad(Value){
    return Value * Math.PI / 180;
}

//Checks distance between 2 gps locations.
//https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
function checkDistance(gps1, gps2){
    var R = 6378137; //Radius in metres
    var distLat = toRad(gps2.latitude-gps1.latitude);
    var distLong = toRad(gps2.longitude-gps1.longitude);
    var lat1 = toRad(gps1.latitude);
    var lat2 = toRad(gps2.latitude);


    var a = Math.sin(distLat/2) * Math.sin(distLat/2)+
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(distLong/2) * Math.sin(distLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c;
		console.log("You are " + distance + "m away from this target");
    return distance; //Returns distance in metres
}

/*
Gets the users location using HTML5 geolocation, takes and watches if the target is near
- Takes location object as input
*/
function watchUserLocation(location){

	if (!navigator.geolocation){
		notifyUser("Something went wrong!", "<p>Geolocation is not supported by your browser.</p>", "");
		return;
	}
  var id, options;
//Wakelock does not work, causes code to crash
//	var wakeLock;

	function success(pos) {
		var crd = pos.coords;
		var currentLoc = new location(crd.latitude, crd.longitude);
		var img = new Image();
  	img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + crd.latitude + "," + crd.longitude + "&zoom=17&size=300x300&sensor=false&key=" + API_KEY;
		var locationOutput = '<p>Latitude is ' + currentLoc.latitude + '° <br>Longitude is ' + currentLoc.longitude + '°</p>';

		notifyUser("Located!", locationOutput, img);

    //Check against only 1 target for now
		for (var i = 0; i < statues.length; i++) {
			var target = new location(statues[i].latitude, statues[i].longitude);
			if (checkDistance(currentLoc,target)<10){
	        console.log('Congratulations, you are within 10m from the target');
					audio.play();
					displayInfo(statues[i]);
					navigator.geolocation.clearWatch(id);
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

//	wakeLock = window.navigator.requestWakeLock('gps');
	id = navigator.geolocation.watchPosition(success, error, options);
}


watchUserLocation(location);
