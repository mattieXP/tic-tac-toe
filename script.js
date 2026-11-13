
const gameBoard = (function() {
    let grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    let resetGrid = function() {
        grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        return [...grid];
    };

    let getGrid = function() {
        return [...grid];
    }

    let putMarker = function(index, marker) {
        if (Number.isInteger(index) && index >= 0 && index <=8 && grid[index] === 0){
            grid[index] = marker;
            return true;
        } else {
            return false;
        };
    };

    return {resetGrid, putMarker, getGrid};
})();

const gameControler = (function() {

    //Créer les joueurs
    let playerOne = createPlayer("Player 1", "X");
    let playerTwo = createPlayer("Player 2", "O");
    let activePlayer = playerOne;
    let gameRunning = true;

    //Definir à qui est le prochain tour
    const nextPlayer = function() {
        if (activePlayer === playerOne) {
            activePlayer = playerTwo;
            displayDOM.anouncements("general", "");
            displayDOM.anouncements("playerOne", "");
            displayDOM.anouncements("playerTwo", "Your turn");
        } else {
            activePlayer = playerOne;
            displayDOM.anouncements("playerTwo", "");
            displayDOM.anouncements("playerOne", "Your turn");
        };
        return activePlayer;
    };

     //Tableau des solutions
    const solutions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ]

    //Déterminer où en est le score (en attente, gagné (si oui, qui?), ex-aequo ?)
    const getResult = function() {
        let result = "await"
        let winner = "";
        let resultGrid = gameBoard.getGrid();

        for(const [a, b, c] of solutions){
             if (resultGrid[a] != 0 && resultGrid[a] === resultGrid[b] && resultGrid[b] === resultGrid[c]) {
            result = "win";
                if (resultGrid[a] === playerOne.getMarker()) {
                    winner = playerOne.getName();
                } else {winner = playerTwo.getName()};
                displayDOM.anouncements("end", `${winner} wins! `);
                break;
            };
        };

        if (result === "await" && resultGrid.every((n) => n != 0 )) {
            result = "tie";
            displayDOM.anouncements("end", "It's a tie!");
        }

       return {result, winner};
    };

    //Jouer un tour (choisir un index, mettre le marker du joueur actif)
    const playRound = function(index) {
        if (gameRunning) {
            let marker = activePlayer.getMarker();
            let moveAccepted = gameBoard.putMarker(index, marker);
            if (moveAccepted) {
                displayDOM.refreshGrid();
                const status = getResult().result;
                if (status === "win" || status === "tie") {
                    gameRunning = false;
                } else {
                    nextPlayer();
                };
            };
        };
    };

   

    //Reset la game quand clique sur bouton "reset"
    const resetAll = function(){
        gameBoard.resetGrid();
        activePlayer = playerOne;
        gameRunning = true;
        displayDOM.refreshGrid();
        displayDOM.anouncements("init");
    };

    return {playRound, getResult, resetAll};

})();

const displayDOM = (function() {

    //Initialise tous les composants du DOM
    const resetButton = document.querySelector("#reset-btn");
    const generalAnouncement = document.querySelector("#general-anouncement");
    const playerOneAnouncement = document.querySelector("#player-one-anouncement");
    const playerOneSelector = document.querySelector("#player-one-selector");
    const playerTwoAnouncement = document.querySelector("#player-two-anouncement");
    const playerTwoSelector = document.querySelector("#player-two-selector");
    const DOM_Boxes = document.querySelectorAll(".game-box");
    const p1Name = document.querySelector("#player-one-name");
    const p2Name = document.querySelector("#player-one-name");


    //Créer les images
    const crossImg = new Image(40, 40);
    crossImg.src = "./graphic assets/Cross.svg";
    const roundImg = new Image(50, 50);
    roundImg.src = "./graphic assets/Round.svg";

    //Surveille le click et donne à playRound quel element du tableau modifier
    DOM_Boxes.forEach((element, index) => {
        element.addEventListener("click", function() {
            console.log(index);
            gameControler.playRound(index);
        });
    });

    //Met à jour la grille à chaque tour
    const refreshGrid = function() {

        let boxes = gameBoard.getGrid();
        boxes.forEach((e, i) => {
            DOM_Boxes[i].textContent = "";
            if (e === "X") {
                const cross = crossImg.cloneNode();
                DOM_Boxes[i].appendChild(cross);
            } else if (e === "O") {
                const round = roundImg.cloneNode();
                DOM_Boxes[i].appendChild(round);
            };
        });
        };

    //Anonces par joueur : Your turn + selector
    const anouncements = function(placeholder, anouncement) {
        switch (placeholder) {
            case "playerOne":
                playerOneAnouncement.textContent = anouncement;
                playerOneSelector.classList.remove("hidden");
                playerTwoSelector.classList.add("hidden");
            break;
            case "playerTwo":
                playerTwoAnouncement.textContent = anouncement;
                playerTwoSelector.classList.remove("hidden");
                playerOneSelector.classList.add("hidden");
            break;
            case "general":
                generalAnouncement.textContent = anouncement;
            break;
            case "end":
                playerOneSelector.classList.add("hidden");
                playerTwoSelector.classList.add("hidden");
                generalAnouncement.textContent = anouncement;
                playerTwoAnouncement.textContent = "";
                playerOneAnouncement.textContent = "";
            break;
            case "init":
                generalAnouncement.textContent = "Let's go!";
                playerOneAnouncement.textContent = "Your turn";
                playerTwoAnouncement.textContent = "";
                playerTwoSelector.classList.add("hidden");
                playerOneSelector.classList.remove("hidden");
        }
    }


    //Surveille le click du Reset et applique la fonction
    resetButton.addEventListener("click", function() {
        gameControler.resetAll();
    });

    //Si les noms sont remplis, les récupérer
    const getNames = function(){
        let name1 = p1Name.addEventListener("")
    };

    return {refreshGrid, anouncements};

})();

function createPlayer(name, marker) {

    let getName = function(){
        return name;
    };
    let getMarker = function(){
        return marker;
    };

    return {getName, getMarker};
};

//Initialise la partie
displayDOM.anouncements("init", "Let's go!");