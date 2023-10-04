/// <reference path="Game.js" />
/// <reference path="../lib/three.js" />
/*
    UI - obsługa interfejsu użytkownika
*/

function Ui() {

    /*document.getElementById("bt1")
                    .addEventListener("click", function () {
                        game.setTest(12);

                    })

    document.getElementById("bt2")
                .addEventListener("click", function () {
                    alert("pobieram zmienną test z klasy Game: " + game.getTest());

                })

    document.getElementById("bt3")
                .addEventListener("click", function () {
                    net.sendData();

                })*/
    document.getElementById("camera")
                .addEventListener("change", function () {
                    game.camera_move(this.value)
                })
    document.getElementById("loguj")
        .addEventListener("click", function () {
        var username = document.getElementById("username").value;
        net.sendData("DODAJ_UZYTKOWNIKA", username);
    });

    document.getElementById("reset")
        .addEventListener("click", function () {
        var username = document.getElementById("username").value;
        net.sendData("RESET", username);


    });
}