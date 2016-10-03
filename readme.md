An augmented reality project intended to push the capabilities of HTML5 & Javascript. 

![Screenshot of project](http://imgur.com/a/15v76)

# Get started 
In order to run this project locally, you must run a localserver. You can do this by running a python server in the command line after navigating to the folder directory using: 

Paste the below code into the command line: 

```
python -m SimpleHTTPServer
```

---

# Folder Structure 

This document will map out the location of each file on the project and it's purpose. 

### js
- model.js - This file interacts with the database and pulls information from the database(currently google spreadsheets - https://developers.google.com/google-apps/spreadsheets/ )
- scripts.js - The core functionality of the application, pulls in information from the model and required plugins. 
- cookies.js - user sessions
- map.js - Google map styling
- notify.js - noty code calls & user notifcations


- Three.js - dependency for loading webgl - https://threejs.org/
- OBJLoader.js - loads obj files
- OrbitControls.js - handles the webgl 3d rotation for obj
- animatedModal.js - handles the modal code/webgl related code
- Detector.js - webgl related code

### noty 
- Jquery plugin - http://ned.im/noty/
- Plugin used to send notifications 
- jquery dependency is held here 

### sounds
- Houses the applications sounds

### nosleep
- git.io/vfn01
- keeps the application from shutting during use

### obj 
- application models are held here

### img
- images

### css 
- styling 
