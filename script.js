//criação de um objeto view para manipular a exibição do jogo
let view = {
    //criação de uma função para exibir mensagens
    displayMessage: function(msg) {
        let messageArea = document.getElementById('messageArea'); //criação de uma variável para armazenar a área de mensagens
        messageArea.innerHTML = msg; //alteração do conteúdo da área de mensagens
    },

    //criação de funções para exibir hits e misses
    displayHit: function(location) {
        let cell = document.getElementById(location); //criação de uma variável para armazenar a célula do tabuleiro
        cell.setAttribute('class', 'hit'); //alteração da classe da célula
    },
    //criação de uma função para exibir misses
    displayMiss: function(location) {
        let cell = document.getElementById(location); //criação de uma variável para armazenar a célula do tabuleiro
        cell.setAttribute('class', 'miss');//alteração da classe da célula
    },
}
/* Path: index.html
view.displayMiss('00'); //miss
view.displayHit('34'); //hit
view.displayMiss('55'); //miss
view.displayHit('12'); //hit
view.displayMiss('25'); //miss
view.displayHit('26'); //hit

view.displayMessage('Tap tap, is this thing on?'); //mensagem
*/
// criando o objeto model

let model = {
    boardSize: 7,            //tamanho do tabuleiro
    numShips: 3,               //quantidade de navios
    shipLength: 3,             // tamanho do navio
    shipsSunk: 0,               // quantidade de navios afundados
    // criando um array para colocar os objetos de 3 navios com suas propriedades
    ships: [                                               
        { locations: [0, 0, 0], hits: ["", "", ""]}, //navio 1
        { locations: [0, 0, 0], hits: ["", "", ""]}, //navio 2
        { locations: [0, 0, 0], hits: ["", "", ""]} //navio 3
    ],
    
    
    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) { //laço para percorrer o array de navios
            let ship = this.ships[i]; //criação de uma variável para armazenar o navio
            let index = ship.locations.indexOf(guess); //criação de uma variável para armazenar o índice do palpite
            if (index >= 0) { //verificação se o palpite é um hit
                ship.hits[index] = 'hit'; //alteração do valor do hit
                view.displayHit(guess); //exibição do hit
                view.displayMessage('Acertou!'); //mensagem de hit
                if (this.isSunk(ship)) { //verificação se o navio foi afundado
                    view.displayMessage('Você afundou meu navio!'); //mensagem de navio afundado
                    this.shipSunk++; //incremento do navio afundado
                }
                return true; //retorno de hit
            }
        }
        view.displayMiss(guess); //exibição de miss
        view.displayMessage('Você errou'); //mensagem de miss
        return false; //retorno de miss
    },

    //criando uma função para verificar se o navio foi afundado
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) { //laço para percorrer o tamanho do navio
            if (ship.hits[i] !== 'hit') { //verificação se o hit é diferente de hit
                return false; //retorno de miss
            }
        }
        return true; //retorno de hit
    },
    gerenateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }


}

//criação de um objeto controller para controlar o jogo

let controller = {
    guesses: 0, //criação de uma variável para armazenar os palpites
    processGuess: function(guess) {
        let location = parseGuess(guess); //criação de uma variável para armazenar o palpite
        if (location) { //verificação se o palpite é válido
            this.guesses++; //incremento dos palpites
            let hit = model.fire(location); //criação de uma variável para armazenar o hit
            if (hit && model.shipsSunk === model.numShips) { //verificação se o navio foi afundado
                view.displayMessage('Você afundou todos os navios em ' + this.guesses + ' palpites!'); //mensagem de vitória
            }
        }
    }

    
}

function parseGuess(guess) {    
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; //criação de um array para armazenar as letras
    if (guess === null || guess.length !== 2) { //verificação se o palpite é nulo ou tem o tamanho diferente de 2
        alert('Por favor, insira um palpite válido!'); //alerta de palpite inválido
    } 
    // criação de uma variável para armazenar o primeiro caractere do palpite
    else {
        let firstChar = guess.charAt(0); //criação de uma variável para armazenar o primeiro caractere do palpite
        let row = alphabet.indexOf(firstChar); //criação de uma variável para armazenar a linha do palpite
        let column = guess.charAt(1); //criação de uma variável para armazenar a coluna do palpite
        if (isNaN(row) || isNaN(column)) { //verificação se a linha ou a coluna não é um número
            alert('Ops, isso não está no tabuleiro!'); //alerta de palpite inválido
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) { //verificação se a linha ou a coluna estão fora do tabuleiro
            alert('Ops, isso não está no tabuleiro!'); //alerta de palpite inválido
        } else {
            return row + column; //retorno da linha e da coluna
        }
    
    }
    return null; //retorno nulo
}

function init () {
    let fireButton = document.getElementById("fireButton"); //criação de uma variável para relaciona o botão de fogo
    fireButton.onclick = handleFireButton; //evento de clique do botão de fogo
    let guessInput = document.getElementById('guessInput'); //criação de uma variável para relacionar o palpite
    guessInput.onkeypress = handleKeyPress; //evento de tecla pressionada
    model.gerenateShipLocations(); //geração das localizações dos navios
}

function handleFireButton() {
    let guessInput = document.getElementById('guessInput'); //criação de uma variável para armazenar o palpite
    let guess = guessInput.value; //criação de uma variável para armazenar o valor do palpite
    controller.processGuess(guess); //processamento do palpite
    guessInput.value = ''; //limpeza do palpite
    guessInput.focus(); //foco no palpite

}

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton'); //criação de uma variável para relacionar o botão de fogo
    if (e.keyCode === 13) { //verificação se a tecla pressionada é enter
        fireButton.click(); //clique no botão de fogo
        return false; //retorno falso
    }
}

window.onload = init; //carregamento da função init
window.onload = pageLoad; //carregamento da função pageLoad

function pageLoad () {
    alert('Bem-vindo ao jogo de batalha naval!'); //alerta de boas-vindas
}


