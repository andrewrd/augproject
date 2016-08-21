//returns an array of locations pulls from database or hardcoded array
function checkList(){
	return arrayOfLocation;
}


//Location object to store location values in
function location(lat, longi){
	this.latitude = lat;
	this.longitude = longi;
}

//Testing location mark
var targetLoc = new location(-33.779705,151.284646);

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
    return distance; //Returns distance in metres
}

/*
Gets the users location using HTML5 geolocation, takes and watches if the target is near
- Takes location object as input
*/
function watchUserLocation(location){

	var output = document.getElementById("notification-container");

	if (!navigator.geolocation){
		output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
		return;
	}
    //Hardcoded target value for testing
	var target = targetLoc;
    var id, options;
//	var wakeLock;

	function success(pos) {
		var crd = pos.coords;
		var currentLoc = new location(crd.latitude, crd.longitude);

		output.innerHTML = '<p>Latitude is ' + currentLoc.latitude + '° <br>Longitude is ' + currentLoc.longitude + '°</p>';
        
        

		var img = new Image();
        img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + crd.latitude + "," + crd.longitude + "&zoom=13&size=300x300&sensor=false";
		output.appendChild(img);
        console.log(checkDistance(currentLoc, target) + " metres away from target");
        
        //Check against only 1 target for now
        if (checkDistance(currentLoc,target)<10){
            console.log('Congratulations, you are within 10m from the target');
            document.getElementById("notification-sound").play();
            navigator.geolocation.clearWatch(id); 
        }

	}

	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	}

	options = {
	 enableHighAccuracy: false,
	 timeout: 5000,
	 maximumAge: 0
	};

//	wakeLock = window.navigator.requestWakeLock('gps');
	id = navigator.geolocation.watchPosition(success, error, options);
}


//Triggers a notification with message if near area
function notifyUser(message){

	return "You reach the location, here's some info";
}


watchUserLocation(location);

