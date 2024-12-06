//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Tell server which port to listen on
app.listen(3000, ()=> {
    console.log("app is listening at localhost:3000");
});
//Initialize the actual HTTP server
// let https = require('https');
// let server = https.createServer(app);
// let port = process.env.PORT || 3000;
// server.listen(port, () => {
//     console.log("Server listening at port: " + port);
// });
