
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

function locationDisplay(locationIndex){
    $("#location-screen").css({
        "visibility": "visible"
    })
    var output = document.getElementById("location-screen");
    for (var i = 0; i < foundStatues.length; i++){
        if (locationIndex == foundStatues[i].id) {
            var target = foundStatues[i];
        }
    }
    if (target != null || target != undefined) {
        output.getElementsByTagName('h3')[0].innerHTML = target.name;
    }
}

$("#location-return").click(function(){
    $("#location-screen").css({
        "visibility": "hidden"
    })
})
