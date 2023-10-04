/// <reference path="UI.js" />
/// <reference path="../lib/three.js" />
/*
    klasa obsługująca komunikację Ajax - em z serwerem
*/

function Net() {
    var client = io()
    client.on("onconnect", function (data) {
        alert(data.clientName)
    })

    this.klocek = function (obiekt) {
        console.log("bla")
        console.log(obiekt)
        client.emit("klocek", {
            klocekID: obiekt.name,
            klocekY: obiekt.userData.index,
            klocekZ: obiekt.position.z,
            klocekX: obiekt.position.x,
            klocekR: rotate,
            wybrany: wybrany
        })
    }
    client.on("klocek", function (data) {
        console.log("lab")
        console.log(data)
        var klocek = new _Klocek(data.klocekR, 1)
        mesh = klocek.mesh
        //klocekNow = klocek
        scene.add(mesh)
        mesh.name = data.klocekID
        game.addID()
        mesh.rotateY(Math.PI / 2 * klocek.obrot)
        mesh.position.set(data.klocekX, data.klocekY * 32, data.klocekZ)//(448, 0, 448);
        mesh.userData = {
            index: data.klocekY,
            type: "klocek",
            dlugosc: klocek.dlugosc,
            obrot: klocek.obrot,
        }
        var wyb = wybrany
        wybrany = data.wybrany
        mesh.material = new THREE.MeshPhongMaterial({
            color: game.getColor(),
            specular: 0xffffff,
            shininess: 50
        })
        wybrany = wyb
    })
    this.kolor = function (cos) {
        client.emit("akcja", {
            id: cos,
            akcja: "kolor",
            wybrany: wybrany,
            klocekR: rotate
        })
    }
    this.rozmiar = function (cos) {
        client.emit("akcja", {
            id: cos,
            akcja: "rozmiar",
            wybrany: wybrany,
            klocekR: rotate
        })
    }
    this.obrot = function (cos) {
        client.emit("akcja", {
            id: cos,
            akcja: "obrot",
            wybrany: wybrany,
            klocekR: rotate
        })
    }
    this.usun = function (cos) {
        client.emit("akcja", {
            id: cos,
            akcja: "usun",
            wybrany: wybrany,
            klocekR: rotate
        })
    }
    client.on("akcja", function (data) {
        switch (data.akcja) {
            case "kolor":
                var wyb = wybrany
                wybrany = data.wybrany
                scene.getObjectByName(data.id).material = new THREE.MeshPhongMaterial({
                    color: game.getColor(),
                    specular: 0xffffff,
                    shininess: 50
                })
                wybrany = wyb
                break;
            case "rozmiar":
                var l = scene.getObjectByName(data.id).userData.dlugosc,
                    r = data.klocekR,
                    x = scene.getObjectByName(data.id).position.x,
                    z = scene.getObjectByName(data.id).position.z,
                    y = scene.getObjectByName(data.id).position.y,
                    i = scene.getObjectByName(data.id).userData.index,
                    d = data.id,
                    m = scene.getObjectByName(data.id).material
                console.log(scene.getObjectByName(data.id))
                scene.remove(scene.getObjectByName(data.id))
                //console.log(x, y, z)
                var klocek = new _Klocek(r, (l) % 5 + 1)
                mesh = klocek.mesh
                //klocekNow = klocek
                scene.add(mesh)
                mesh.name = d
                mesh.rotateY(Math.PI / 2 * (4 - klocek.obrot))
                mesh.position.set(x,y,z)
                mesh.userData = {
                    index: i,
                    type: "klocek",
                    dlugosc: klocek.dlugosc,
                    obrot: klocek.obrot
                }
                mesh.material = m;
                break;
            case "obrot":
                scene.getObjectByName(data.id).rotateY(-Math.PI / 2)
                break;
            case "usun":
                scene.remove(scene.getObjectByName(data.id))
                break;
        }

    })
}
