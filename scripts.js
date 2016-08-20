
//returns an array of locations pulls from database or hardcoded array
function checkList(){
	return arrayOfLocation;
}

//Gets the users location using HTML5 geolocation
function getUserLocation(){
	//Gets the user location
	var options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	function success(pos) {
	  var crd = pos.coords;
	  console.log('Your current position is:');
	  console.log('Latitude : ' + crd.latitude);
	  console.log('Longitude: ' + crd.longitude);
	  console.log('More or less ' + crd.accuracy + ' meters.');
	};

	function error(err) {
	  console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	navigator.geolocation.getCurrentPosition(success, error, options);
}

//Gets user location

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
/*		if(compareLocation(getLocations[i], 20){
			notifyUser();
		} */
	}

}

getUserLocation();

