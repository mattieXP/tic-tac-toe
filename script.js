/*const generalAnouncement = document.querySelector("#general-anouncement");
const PlayerOneAnouncement = document.querySelector("#player-one-anouncement");
const PlayerTwoAnouncement = document.querySelector("#player-two-anouncement")
const GameGrid = document.querySelector("#grid");*/



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
            } else {activePlayer = playerOne};
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
                break;
            };
        };

        if (result === "await" && resultGrid.every((n) => n != 0 )) {
            result = "tie"; }

       return {result, winner};
    };

    //Jouer un tour (choisir un index, mettre le marker du joueur actif)
    const playRound = function(index) {
        if (gameRunning) {
            let marker = activePlayer.getMarker();
            let moveAccepted = gameBoard.putMarker(index, marker);
            if (moveAccepted) {
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
    };

    return {playRound, getResult, resetAll};

})();

const displayDOM = (function() {

    //Anonce quand gagné et ex-aequo + Freeze les cases si gagné ou ex-aequo

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

