/// <reference path="Game.js" />
/// <reference path="ElementSiatki.js" />
/// <reference path="Klocek.js" />
/// <reference path="../index.html" />
/// <reference path="../lib/three.js" />
var scene,
    camera,
    deleteKlocek = false,
    rotate = 3,
    wybrany = 0
        
function Main() {
    var raycaster,
        mouseVector,
        renderer,
        plansza,
        size = 15,
        light,
        axis
    function animateScene() {
        requestAnimationFrame(animateScene);
        renderer.render(scene, camera);
    }
    function resizeCamera() {
        var cam = camera,
            szerokosc = window.innerHeight * 1.25,
            wysokosc = window.innerHeight
        if (window.innerHeight * 1.25 > window.innerWidth) {
            szerokosc = window.innerWidth
            wysokosc = window.innerWidth * 0.8
        }
        cam.aspect = 1
        // notify the renderer of the size change
        renderer.setSize(szerokosc, wysokosc);
        // update the camera
        cam.left = szerokosc / -2
        cam.right = szerokosc / 2
        cam.top = wysokosc / 2
        cam.bottom = wysokosc / -2
        cam.zoom = (szerokosc / 1300) / (size / 15)
        cam.updateProjectionMatrix();
    }
    function createScene() {
        var klocek,
            mesh
        scene = new THREE.Scene()
        camera = new THREE.OrthographicCamera(
            100 / -2,
            100 / 2,
            100 / 2,
            100 / -2,
            0.1, // minimalna renderowana odległość
            20000 // maxymalna renderowana odległość
        )
        raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
        mouseVector = new THREE.Vector2() // wektor (x,y) wykorzystany będzie do określenie pozycji myszy na ekranie
        renderer = new THREE.WebGLRenderer()
        renderer.setClearColor(0x3F6077);
        document.getElementById("render").appendChild(renderer.domElement);
        scene.add(camera)
        camera.position.x = 750//0;
        camera.position.y = 500//500;
        camera.position.z = 750//1250;
        camera.position.set(2000, 750, 1000)
        camera.lookAt(scene.position);

        /*klocek = new _Klocek(rotate, 1)
        mesh = klocek.mesh
        scene.add(mesh)
        mesh.rotateY(Math.PI / 2 * klocek.obrot)
        mesh.position.set(32 * -(size - 1), 0, 32 * -(size - 1))//(448, 0, 448);*/

        plansza = new _Plane(size, size)
        console.log(plansza)
        for (var i in plansza.mesh) {
            scene.add(plansza.mesh[i])
        }
        light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(32 * (size - 1), 16*size, 32 * (size - 1));
        scene.add(light);
        
        axis = new THREE.AxisHelper(32 * size);
        scene.add(axis);
        window.addEventListener('resize', function (event) {
            resizeCamera()
        })
        resizeCamera()
        animateScene();
    }
    function init() {
        createScene()
        game.createRaycaster()
        game.Key()
    }
    init()
}