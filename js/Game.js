
function Game() {
    var kolory = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00, 0x00ffff],
        klocekNow,
        id = 0
    this.getColor = function() {
        return kolory[wybrany];
    }
    this.getID = function () {
        return id;
    }
    this.addID = function () {
        id++;
    }
    this.getNow = function () {
        return klocekNow;
    }
    this.createRaycaster = function () {

        document.addEventListener("mousedown", onMouseDown, false);

        var raycaster = new THREE.Raycaster(),
            mouseVector = new THREE.Vector2(),
            intersects

        function onMouseDown(event) {
            var szerokosc = window.innerHeight * 1.25,
                wysokosc = window.innerHeight,
                szerokoscV,
                wysokoscV
            if (window.innerHeight * 1.25 > window.innerWidth) {
                szerokosc = window.innerWidth
                wysokosc = window.innerWidth * 0.8
            }

            szerokoscV = Math.round(event.clientX - (window.innerWidth - szerokosc) / 2)
            wysokoscV = Math.round(event.clientY - (window.innerHeight - wysokosc) / 2)

            mouseVector.x = (szerokoscV / szerokosc) * 2 - 1;
            mouseVector.y = -(wysokoscV / wysokosc) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);
            intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0 && !(mouseVector.x > 1 || mouseVector.x < -1 || mouseVector.y > 1 || mouseVector.y < -1)) {
                for (var i in intersects) {
                    if (intersects[i].object.userData.type == "lockedK" ){//|| intersects[i].object.userData.type == "lockedP") {
                        if (deleteKlocek == true) {
                            scene.remove(intersects[i].object)
                            if(net)
                                net.usun(intersects[i].object.mesh.name)
                        }
                        klocekNow = undefined;
                        break
                    } else if (intersects[i].object.userData.type == "plane" && deleteKlocek == false) {
                        var klocek = new _Klocek(rotate, 1)
                        mesh = klocek.mesh
                        klocekNow = klocek
                        scene.add(mesh)
                        mesh.name = game.getID()
                        game.addID()
                        mesh.rotateY(Math.PI / 2 * klocek.obrot)
                        mesh.position.set(intersects[i].object.position.x, (intersects[i].object.userData.index + 1) * 32, intersects[i].object.position.z)//(448, 0, 448);
                        mesh.userData = {
                            index: intersects[i].object.userData.index + 1,
                            type: "klocek",
                            dlugosc: klocekNow.dlugosc,
                            obrot: klocekNow.obrot
                        }
                        if (net)
                            net.klocek(mesh)
                        //intersects[i].object.userData.type = "lockedP"
                        break
                    } else if (intersects[i].object.userData.type == "klocek") {
                        if (deleteKlocek == false) {
                            var klocek = new _Klocek(rotate, 1)
                            mesh = klocek.mesh
                            klocekNow = klocek
                            scene.add(mesh)
                            mesh.name = game.getID()
                            game.addID()
                            mesh.rotateY(Math.PI / 2 * klocek.obrot)
                            mesh.position.set(intersects[i].object.position.x, (intersects[i].object.userData.index + 1) * 32, intersects[i].object.position.z)//(448, 0, 448);
                            mesh.userData = {
                                index: intersects[i].object.userData.index + 1,
                                type: "klocek",
                                dlugosc: klocekNow.dlugosc,
                                obrot: klocekNow.obrot
                            }
                            if (net)
                                net.klocek(mesh)
                            //intersects[i].object.userData.type = "lockedK"
                        } else {
                            scene.remove(intersects[i].object)
                            if (net)
                                net.usun(intersects[i].object.mesh.name)
                            klocekNow = undefined;
                        }
                        break
                    }
                }
                //obiekt = ziemniak
                //console.log(obiekt.name)
                //net.klocek()*/
            }
            console.log(klocekNow)
        }
    }
    function action(type) {
        switch (type) {
            case 81:
                deleteKlocek = !deleteKlocek;
                if (deleteKlocek) {
                    document.getElementById("delInstruction").innerHTML = "[Q] - dodaj klocek"
                } else {
                    document.getElementById("delInstruction").innerHTML = "[Q] - usuń klocek"
                }
                break;
            case 87:
                var l = klocekNow.dlugosc,
                    r = klocekNow.obrot,
                    x = klocekNow.mesh.position.x,
                    z = klocekNow.mesh.position.z,
                    y = klocekNow.mesh.position.y,
                    i = klocekNow.mesh.userData.index,
                    d = klocekNow.mesh.name
                scene.remove(klocekNow.mesh)
                console.log(x, y, z)
                var klocek = new _Klocek(rotate, (l) % 5 + 1)
                mesh = klocek.mesh
                klocekNow = klocek
                scene.add(klocekNow.mesh)
                mesh.name = d
                console.log(klocekNow.mesh)
                mesh.rotateY(Math.PI / 2 * (4-klocek.obrot))
                mesh.position.set(x, y, z)
                mesh.userData = {
                    index: i,
                    type: "klocek",
                    dlugosc: klocek.dlugosc,
                    obrot: klocek.obrot
                }
                break;
            case 69:
                wybrany = (wybrany + 1) % 6
                klocekNow.mesh.material = new THREE.MeshPhongMaterial({
                    color: game.getColor(),
                    specular: 0xffffff,
                    shininess: 50
                })
                console.log(klocekNow.mesh.material.color)
                break;
            case 82:
                klocekNow.obrot = (klocekNow.obrot + 1) % 4
                console.log(klocekNow.obrot)
                rotate = klocekNow.obrot
                klocekNow.mesh.rotateY(-Math.PI / 2)
                break;
        }
    }
    this.Key = function () {
        function onKeyDown(event) {
            var keyCode = event.which;
            action(keyCode);
            switch (keyCode) {
                case 87:
                    if (net)
                        net.rozmiar(klocekNow.mesh.name)
                    break;
                case 69:
                    if (net)
                        net.kolor(klocekNow.mesh.name)
                    break;
                case 82:
                    if (net)
                        net.obrot(klocekNow.mesh.name)
                    break;
            }
        }
        function onKeyUp(event) {
            var keyCode = event.which;
            switch (keyCode) {
                case 38:
                    break;
                case 40:
                    break;
                case 39:
                    break;
                case 37:
                    break;
            }
        }
        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("keyup", onKeyUp, false);
    }
}