/// <reference path="Game.js" />
/// <reference path="Main.js" />
/// <reference path="ElementSiatki.js" />
/// <reference path="../index.html" />
/// <reference path="../lib/three.js" />

function _Plane() {
    function planeMesh(){
        var lineGeometry,
            planeGeometry,
            cylinderMaterial,
            lineMaterial,
            planeMaterial,
            line,
            plane,
            cylinderGeometryBig,
            cylinderGeometrySmall,
            siatka = []
        cylinderMaterial = new THREE.MeshBasicMaterial({
            color: 0xc6e2ff, side: THREE.FrontSide, wireframe: true // 0xc6e2ff
        });
        lineMaterial = new THREE.LineBasicMaterial({ color: 0xc6e2ff });
        planeMaterial = new THREE.MeshBasicMaterial({ color: 0x3F6077 })
        lineGeometry = new THREE.Geometry();
        cylinderGeometryBig = new THREE.Geometry();
        cylinderGeometrySmall = new THREE.Geometry();

        lineGeometry.vertices.push(new THREE.Vector3(-32, 0, -32));
        lineGeometry.vertices.push(new THREE.Vector3(32, 0, -32));
        lineGeometry.vertices.push(new THREE.Vector3(32, 0, 32));
        lineGeometry.vertices.push(new THREE.Vector3(-32, 0, 32));
        lineGeometry.vertices.push(new THREE.Vector3(-32, 0, -32));

        line = new THREE.Line(lineGeometry, lineMaterial);
            var tab = [[15, 1, 15], [-15, 1, 15], [-15, 1, -15], [15, 1, -15], ]
            for (var k in tab) {
                var geometryBig,
                    geometrySmall,
                    meshBig,
                    meshSmall
                geometrySmall = new THREE.CylinderGeometry(9, 9, 0.1, 20);
                meshSmall = new THREE.Mesh(geometrySmall)
                meshSmall.position.set(tab[k][0], tab[k][1], tab[k][2])
                meshSmall.updateMatrix()
                cylinderGeometrySmall.merge(meshSmall.geometry, meshSmall.matrix)
                geometryBig = new THREE.CylinderGeometry(11, 11, 0.1, 20);
                meshBig = new THREE.Mesh(geometryBig)
                meshBig.position.set(tab[k][0], tab[k][1], tab[k][2])
                meshBig.updateMatrix()
                cylinderGeometryBig.merge(meshBig.geometry, meshBig.matrix)
            }
            var bigBSP,
                smallBSP,
                intersectionBSP,
                hollowCylinder
            smallBSP = new ThreeBSP(cylinderGeometrySmall);
            bigBSP = new ThreeBSP(cylinderGeometryBig);
            intersectionBSP = bigBSP.subtract(smallBSP);
            hollowCylinder = intersectionBSP.toMesh(lineMaterial);
            hollowCylinder.updateMatrix();
            
        planeGeometry = new THREE.PlaneBufferGeometry(64, 64)
        plane = new THREE.Mesh(planeGeometry, planeMaterial)
        plane.rotateX(Math.PI / -2);

        for (var i = 0; i < arguments[0]; i++) {
            for (var j = 0; j < arguments[0]; j++) {
                var lineClone = line.clone(),
                    cylinderClone = hollowCylinder.clone(),
                    planeClone = plane.clone()
                lineClone.userData = {
                    position: i * j + 1,
                    type: "line"
                }
                cylinderClone.userData = {
                    position: i * j + 2,
                    type: "cylinder"
                }
                planeClone.userData = {
                    position: i * j + 3,
                    type: "plane",
                    index: -1
                    //upCylinder: function () {
                    //    this.position
                    //}
                }
                cylinderClone.position.set(((arguments[0] - 1 - i * 2) * 64 / -2), -11, ((arguments[0] - 1 - j * 2) * 64 / -2))
                lineClone.position.set(((arguments[0] - 1 - i * 2) * 64 / -2), -11, ((arguments[0] - 1 - j * 2) * 64 / -2))
                planeClone.position.set(((arguments[0] - 1 - i * 2) * 64 / -2), -12, ((arguments[0] - 1 - j * 2) * 64 / -2))
                if (arguments[0] < 35) {
                    siatka.push(cylinderClone)
                } else {
                    siatka.push()
                }
                siatka.push(lineClone)
                siatka.push(planeClone)
            }
        }

        return siatka
    }
    this.wymiar = arguments[0];
    this.mesh = planeMesh(this.wymiar)
}