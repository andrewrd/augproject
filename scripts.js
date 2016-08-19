//returns an array of locations pulls from database or hardcoded array
function checkList(){
	return arrayOfLocation;
}

//Gets the users location using HTML5 geolocation
function getUserLocation(){
	return location;
}


//Calculates the location based upon radius of area 
function compareLocation(gps1, metres){
	var user = getUserLocation();
	var locations = checkList();
	return true;
}

//Triggers a notification with message if near area
function notifyUser(message){
	return "";
}


//Event listener that triggers a conditional if the latitude and longditude is met and calls location
function watchUser(){
	var getLocations = checkList();
	//Event listener here that is delayed for phone
	for(var i=0; i<getLocations.length(); i++){
		if (compareLocation(getLocations[i], 20){
			notifyUser();
		}
	}

}

