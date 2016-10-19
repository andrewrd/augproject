//Google API Key, for development purposes all localmachines are allowed. Change this in production.
var API_KEY = 'AIzaSyAsJGvBskayVLIScXlb9WeCAypC9wGUf40';

/* Pulls the google sheet information using the Google API
This is hosted on: https://docs.google.com/spreadsheets/d/1euM71LMUJfVAMVsmXqGpsKhmqQZJgPd8UgGbBihU2e8/edit#gid=0 */
var dblink =" https://sheets.googleapis.com/v4/spreadsheets/1euM71LMUJfVAMVsmXqGpsKhmqQZJgPd8UgGbBihU2e8?includeGridData=true&fields=sheets%2Fdata%2FrowData%2Fvalues%2FuserEnteredValue&key=" + API_KEY;
//Sends a get request to the user, should be a callback but update this when possible
//Deprecated code, we have to remove this and replace with syncronous
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//statue object to store statues in
function statue(name, year, desc, lat, longi, id, question, answer) {
    this.name = name;
    this.year = year;
    this.description = desc;
    this.latitude = lat;
    this.longitude = longi;
    this.id = id;
    //Question and answer
    this.question = question;
    this.answer = answer; 
}

//Prints output in json in console
var database = JSON.parse(httpGet(dblink));
var cursor = database.sheets[0].data[0].rowData;

//Creates an array of locations, traversing the array to the exact values needed for the statue function
//use this to create the array, locations2 returns a json file.

var locations2 = [];

function createArrayLoc(){

  var locations = [];
  var store = [];

    for (item in cursor){
        locations.push(cursor[item].values);
    }

    for(var i = 0; i<locations.length; i++){
        store.push(locations[i]);
    }

    for(var i = 0; i<store.length; i++){
        for(var b = 0; b<store[i].length; b++){
            if(store[i][b].userEnteredValue.stringValue == undefined){
                locations2.push(store[i][b].userEnteredValue.numberValue);
            } else {
                locations2.push(store[i][b].userEnteredValue.stringValue);
            }
        }
    }
    //Locations2 contains
    console.log(locations2);
    return locations2;
    //this should return an array of values for each location
}

//call that fills locations2
createArrayLoc();

//instantiates a new statues array to store data from googledoc as statue objects
var statues = [];

//To add in additional values, increment this section by a factor of 1 
var statueCounter = 0;
//iterates over locations2, creates objects from the values and stores in statues
for (var i = 0; i <locations2.length; i+=5) {
  statues.push(new statue(locations2[i], locations2[i+1],locations2[i+2], locations2[i+3], locations2[i+4], statueCounter, locations2[i+5], locations2[i+6]));
  statueCounter++;
}
