
//returns an array of locations pulls from database or hardcoded array
function checkList(){
	return arrayOfLocation;
}

//added location object to store location values in
function location(lat, longi){
	this.latitude = lat;
	this.longitude = longi;
}


//Gets the users location using HTML5 geolocation
function getUserLocation(){
    var id, target, options;
	var wakeLock;

	function success(pos) {
	 var crd = pos.coords;

	 if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
	   console.log('Congratulations, you reached the target');
	   navigator.geolocation.clearWatch(id);
	   wakeLock.unlock();
	 }
	}

	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	}

	target = {
	 latitude : 0,
	 longitude: 0
	};

	options = {
	 enableHighAccuracy: false,
	 timeout: 5000,
	 maximumAge: 0
	};

	wakeLock = window.navigator.requestWakeLock('gps');
	id = navigator.geolocation.watchPosition(success, error, options);
}



//Calculates the location based upon radius of area 
function compareLocation(gps1, metres){
	var user = getUserLocation();
	var locations = checkList();
	return true;
}

//Triggers a notification with message if near area
function notifyUser(message){

}


//Event listener that triggers a conditional if the latitude and longditude is met and calls location
function watchUser(){
	var getLocations = checkList();
	//Event listener here that is delayed for phone
	for(var i=0; i<getLocations.length; i++){
		/*if(compareLocation(getLocations[i], 20){
			notifyUser();
		} */
	}

}

getUserLocation();

