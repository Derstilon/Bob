var fs = require("fs");
var http = require("http");
var socketio = require("socket.io")

//MongoDB
var mongoose = require("mongoose")
var Models = require("./database/Models.js")(mongoose)
mongoose.connect('mongodb://localhost/testKlasaGrupa');
var Operations = require("./database/Operations.js")
var db;
var opers = new Operations();
//MongoDB
var server = http.createServer(function (req, res) {
    console.log(req.method, req.url)
    switch (req.method) {
        case "GET": {
            console.log(req.url.split(".")[1])
            if (req.url == "/") {
                get_file("/index.html", 'text/html', res)
            }
            else if (req.url == "/favicon.ico") {

            }
            else {
                switch (req.url.split(".")[1]) {
                    case "js": {
                        get_file(req.url, "application/javascript", res)
                        break;
                    }
                    case "jpeg": {
                        get_file(req.url, "application/javascript", res)
                        break;
                    }
                    case "css": {
                        get_file(req.url, "text/css", res)
                        break;
                    }
                    case "html": {
                        get_file(req.url, "text/html", res)
                        break;
                    }
                }
            }
            break;
        }
        case "POST": {
            break;
        }
    }
})

server.listen(3000);
console.log("serwer startuje na porcie 3000 - ten komunikat zobaczysz tylko raz")

function connectToMongo() {

    db = mongoose.connection;

    //przy wystąpieniu błędu

    db.on("error", function () {
        console.log("problem z mongo")
    });

    //przy poprawnym połączeniu z bazą

    db.once("open", function () {
        console.log("mongo jest podłączone - można wykonywać operacje na bazie");
    });

    //przy rozłączeniu z bazą

    db.once("close", function () {
        console.log("mongodb zostało odłączone");
    });
}

connectToMongo();

var io = socketio.listen(server)

io.sockets.on("connection", function (client) {
    client.emit("onconnect", {
        clientName: client.id
    })
    client.on("disconnect", function () {
        console.log("klient się rozłącza")
    })
    client.on("klocek", function (data) {
        client.broadcast.emit("klocek", { klocekID: data.klocekID, klocekY: data.klocekY, klocekZ: data.klocekZ, klocekX: data.klocekX, klocekR: data.klocekR, wybrany: data.wybrany });
    })
    client.on("akcja", function (data) {
        client.broadcast.emit("akcja", { id: data.id, akcja: data.akcja, wybrany: data.wybrany, klocekR: data.klocekR });
    })
})

function get_file(url, method, res) {
    fs.readFile("static" + url, function (error, data) {

        if (error) {
            res.writeHead(404, { 'Content-Type': method });
            res.write("<h1>błąd 404 - nie ma pliku!<h1>");
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': method })
            res.write(data)
            res.end()
        }
    })
}