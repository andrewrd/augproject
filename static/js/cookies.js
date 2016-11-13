//functions for returning cookie values and found statues

function checkCookie(cookieName) {
    if (document.cookie.indexOf(cookieName) >= 0) {
        return getCookie(cookieName).split(",");
    } else {
        document.cookie = cookieName + "=; expires=" + expiry.toGMTString();
        return [];
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
function saveCookie(cookieName, saveArray) {
    var cookieString = saveArray.join();
    document.cookie = cookieName + "=" + cookieString + "; expires=" + expiry.toGMTString();
}

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
    return foundStatues;
}

//removes the statue at targetIndex from the targetArray
function removeStatue(targetArray, targetIndex) {
    targetArray.splice(targetIndex, 1);
}
