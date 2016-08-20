
//returns an array of locations pulls from database or hardcoded array
function checkList(){
	return arrayOfLocation;
}

//added location object to store location values in
function location(lat, longi){
	this.latitude = lat;
	this.longitude = longi;
}

var location = {};
location[0] = {
 latitude : 0,
 longitude: 0
};

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

	var target = location;
    var id, options;
//	var wakeLock;

	function success(pos) {
		var crd = pos.coords;
		console.log(crd.latitude);

		output.innerHTML = '<p>Latitude is ' + crd.latitude + '° <br>Longitude is ' + crd.longitude + '°</p>';

		var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + crd.latitude + "," + crd.longitude + "&zoom=13&size=300x300&sensor=false";
		output.appendChild(img);


		for(var i=0; i<target.length; i++){
			 if (target[i].latitude === crd.latitude && target[i].longitude === crd.longitude) {
			   console.log('Congratulations, you reached the target');
				 document.getElementById("notification-sound").play();
			   navigator.geolocation.clearWatch(id);
//			   wakeLock.unlock();
			 }
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
	return "You reach the location, here's some info"
}


watchUserLocation(location);
