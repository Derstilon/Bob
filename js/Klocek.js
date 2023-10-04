/// <reference path="Game.js" />
/// <reference path="Main.js" />
/// <reference path="ElementSiatki.js" />
/// <reference path="../index.html" />
/// <reference path="../lib/three.js" />

function _Klocek() {
    function meshKlocka(){
        var geometry,
            geometries = [],
            singleGeometry,
            container,
            material,
            singleMesh,
            mesh,
        material = new THREE.MeshPhongMaterial({
            color: arguments[1],
            specular: 0xffffff,
            shininess: 50
        })
        geometry = new THREE.BoxGeometry(64, 31.5, 64 * arguments[0]);
        singleGeometry = new THREE.Geometry()
        container = new THREE.Object3D();
        mesh = new THREE.Mesh(geometry);
        mesh.position.set(0, -16, -32 * (arguments[0] - 1))
        singleMesh = new THREE.Object3D();
        mesh.updateMatrix();
        singleGeometry.merge(mesh.geometry, mesh.matrix)
        for (var i = 0; i < arguments[0]; i++) {
            var tab = [[15, 3.5, 15], [-15, 3.5, 15], [-15, 3.5, -15], [15, 3.5, -15], ]
            for (var j in tab) {
                var geometry,
                    mesh
                geometry = new THREE.CylinderGeometry(9, 9, 8, 20);
                mesh = new THREE.Mesh(geometry);
                mesh.position.set(tab[j][0], tab[j][1], tab[j][2] - 64 * i)//-26 * (arguments[0] - 1))
                mesh.updateMatrix();
                singleGeometry.merge(mesh.geometry, mesh.matrix)
            }

        }
        singleMesh = new THREE.Mesh(singleGeometry, material);
        return singleMesh
    }
    this.dlugosc = arguments[1];
    this.obrot = arguments[0];
    this.kolor = game.getColor()
    this.mesh = meshKlocka(this.dlugosc, this.kolor)
}