mongoose = require("mongoose");
https = require("https");
fs = require("fs");

app = require("./app");

var options = {
    key: fs.readFileSync("conf/key.pem"),
    cert: fs.readFileSync("conf/cert.pem")
};

port = 8081;

mongoose.connect("mongodb://admin:1qazZAQ!@10.42.10.58:27017/alfraxat",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
    ssl: false,
    sslValidate: true
})

.then(()=>{
    console.log("Connexió establerta");
    https.createServer(options, app).listen(port, ()=>{
        console.log("Servidor funcionant correctament");
    });
}).catch (err => console.log(err));
