var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update });

var playerSpeed = 6;
var powerUpSpeed = 2;

var players = [];
var powerUp;
var powerUpTime = 0;

var gameTime = 0;
var timeText;

var gameOverTexts;
var titleTexts;

var state = 'title';

var instructions = [
"Player 1: Arrow Keys",
"Player 2: WASD",
"Player 3: IJKL",
"Player 4: TFGH",
"Seize the EU fragment to turn huge",
"Fly into other players to attack them",
]

var colors = [
'red',    
'#00FF00',  
'#0077FF',
'purple', 
'white',
'white',
]

function preload() {

    game.load.image('player1', 'p1.png');
    game.load.image('player2', 'p2.png');
    game.load.image('player3', 'p3.png');
    game.load.image('player4', 'p4.png');
    game.load.image('powerup', 'EUlogo.png');
}

function create() {
    game.stage.backgroundColor = '111111';

    var timeTextStyle = { font: "20px Arial", fill: "#FFFFFF", align: 'center'};
    timeText = game.add.text(game.width / 2, 0, "0:00", timeTextStyle);

    // some great coding here
    var key;
    key = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    key.onDown.add(startGame1Player);
    key = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    key.onDown.add(startGame2Player);
    key = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    key.onDown.add(startGame3Player);
    key = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    key.onDown.add(startGame4Player);

    //startGame();
    startTitle();
}

function startGame1Player() {
    if (state != 'game') {
        startGame(1);
    }
}

function startGame2Player() {
    if (state != 'game') {
        startGame(2);
    }
}

function startGame3Player() {
    if (state != 'game') {
        startGame(3);
    }
}

function startGame4Player() {
    if (state != 'game') {
        startGame(4);
    }
}

//------------------------------------------------
//              STATE TRANSITIONS
//------------------------------------------------
function startGame(numPlayers) {
    if (state == 'title') {
        endTitle();
    }

    initialisePlayers(numPlayers);
    initialisePowerUp();
    gameTime = 1.5 * 60 * 60;
    //gameTime = 10 * 60;

    state = 'game'
}

function startTitle() {
    if (state == 'gameover') {
        endGameOver();
    }

    titleTexts = []

    var textStyle = { font: '80px Arial', fill: '#FFFFFF', align: 'center'};
    var title = game.add.text(0.5 * game.width, 0.2 * game.height, 'WORKING TITLE 2', textStyle);
    title.anchor.x = 0.5;
    titleTexts.push(title);

    var controlStyle = { font: '40px Arial', fill: '#FFFFFF', align: 'center'};
    for (var i = 0; i < instructions.length; i ++) {
        var amt = i / (instructions.length - 1);
        var yPos = 0.45 + 0.35 * amt;
        controlStyle.fill = colors[i];
        var controlText = game.add.text(0.5 * game.width, yPos * game.height, instructions[i], controlStyle);
        controlText.anchor.x = 0.5;
        titleTexts.push(controlText);
    }

    state = 'title'
}

function endTitle() {
    for (var i = 0; i < titleTexts.length; i ++) {
        titleTexts[i].destroy();
    }
}

function startGameOver() {
    powerUp.destroy();
    powerUp = null;
    for (var i = 0; i < players.length; i ++) {
        makePlayerRegular(players[i]);
    }

    gameOverTexts = [];

    var textStyle = { font: "80px Arial", fill: "#FFFFFF", align: 'center'};
    var gameOverText = game.add.text(game.width / 2, 0.4 * game.height, 'GAME OVER', textStyle);
    gameOverText.anchor.set(0.5);
    gameOverTexts.push(gameOverText);

    var winner = 0;
    for (i = 0; i < players.length; i ++) {
        if (players[i].score > players[winner].score) {
            winner = i;
        }
    }

    var winTextStyle = { font: "60px Arial", fill: colors[winner], align: 'center'};
    var winMessage = 'Player ' + (winner + 1) + ' wins!'
    var winText = game.add.text(game.width / 2, 0.7 * game.height, winMessage, winTextStyle);
    winText.anchor.set(0.5);
    gameOverTexts.push(winText);

    state = 'gameover'
}

function endGameOver() {
    for (var i = 0; i < gameOverTexts.length; i ++) {
        gameOverTexts[i].destroy();
    }
}

function initialisePowerUp() {
    powerUp = game.add.sprite(game.width / 2, game.height / 2, 'powerup')
    powerUp.scale.setTo(0.1, 0.1);
    powerUp.xSpeed = 0;
    powerUp.ySpeed = 0;
}

function initialisePlayers(numPlayers) {
    // TODO: Make the number of players selectable somewhere, somehow
    
    // This creates all the players with one big array literal.
    // Could bit made a little more modular, but on the whole it's ok.
    var settings = [
        ['player1', ['UP', 'LEFT', 'DOWN', 'RIGHT'], colors[0], true,  true ],
        ['player2', ['W', 'A', 'S', 'D'],            colors[1], true,  false],
        ['player3', ['I', 'J', 'K', 'L'],            colors[2], false, true ],
        ['player4', ['T', 'F', 'G', 'H'],            colors[3], false, false],
    ];
    players = []
    for (var i = 0; i < numPlayers; i ++) {
        // setting
        var s = settings[i];
        var player = createPlayer(s[0], s[1], s[2], s[3], s[4]);
        players.push(player);
    }
    //makePlayerMega(players[0]);
}

function destoryPlayers() {
    for (var i = 0; i < players.length; i ++) {
        players[i].sprite.destroy();
        players[i].scoreText.destroy();
    }
    //game.input.keyboard.destroy();
}

function createPlayer(spriteName, keyNames, color, upEdge, leftEdge) {
    var fontStyle = { font: "20px Arial", fill: color };
    if (leftEdge) {
        fontStyle.align = "left";
    }
    else {
        fontStyle.align = "right";
    }
    player = {
        sprite: game.add.sprite(0, 0, spriteName),
        keys: game.input.keyboard.addKeys({
            'up':    Phaser.KeyCode[keyNames[0]],
            'left':  Phaser.KeyCode[keyNames[1]],
            'down':  Phaser.KeyCode[keyNames[2]],
            'right': Phaser.KeyCode[keyNames[3]],
        }),
        color: color,
        speedScale: 1.0,
        powerUp: null,
        scoreText: game.add.text(0, 0, '0', fontStyle),
        score: 0,
        deadCount: 0
    }
    if (upEdge) {
        player.sprite.y = 0;
        player.scoreText.y = 0;
    }
    else {
        player.sprite.y = game.height - player.sprite.height;
        player.scoreText.y = game.height - player.scoreText.height;
    }
    if (leftEdge) {
        player.sprite.x = 0;
        player.scoreText.x = 0;
    }
    else {
        player.sprite.x = game.width - player.sprite.width;
        player.scoreText.x = game.width - player.scoreText.width;
        player.scoreText.anchor.x = 1;
    }
    makePlayerRegular(player)
    return player;
}

function updateScore(player) {
    player.scoreText.setText(player.score);
}

function makePlayerRegular(player) {
    changePlayerScale(player, 0.25);
    player.speedScale = 1.0;
    player.powerUp = null;
}

function makePlayerMega(player) {
    changePlayerScale(player, 0.5);
    player.speedScale = 1.1;
    player.powerUp = "mega";
}

function makePlayerVulnerable(player) {
    player.sprite.alpha = 1;
}

function makePlayerDead(player) {
    player.deadCount = 60;
    player.sprite.alpha = 0.2;
}

function changePlayerScale(player, scale) {
    player.sprite.x += player.sprite.width / 2;
    player.sprite.y += player.sprite.height / 2;
    player.sprite.scale.setTo(scale, scale);
    player.sprite.x -= player.sprite.width / 2;
    player.sprite.y -= player.sprite.height / 2;
}

function randomisePowerUp() {
    // The initial value is just so the loop runs once
    var touchingSomething = true;
    while (touchingSomething) {
        powerUp.x = (game.width - powerUp.width) * Math.random();
        powerUp.y = (game.height - powerUp.height) * Math.random();

        // check if the power up is touching a player, if so, we restart.
        touchingSomething = false;
        for (var i = 0; i < players.length; i ++) {
            if (spritesTouching(players[i].sprite, powerUp)) {
                touchingSomething = true;
                break;
            }
        }
    }
    powerUp.xSpeed = Math.random() < 0.5 ? -powerUpSpeed : powerUpSpeed;
    powerUp.ySpeed = Math.random() < 0.5 ? -powerUpSpeed : powerUpSpeed;
}

function spritesTouching(sprite1, sprite2) {
    // This is a simple test to see whether two rectangles overlap.
    return sprite1.right  > sprite2.left &&
           sprite2.right  > sprite1.left &&
           sprite1.bottom > sprite2.top &&
           sprite2.bottom > sprite1.top;
}

function update() {
    if (state == 'game') {
        gameTime --;
        if (gameTime < 0 && state == 'game') {
            startGameOver();
        }
    }
    else {
        gameTime = 0;
    }
    var seconds = (Math.floor(gameTime / 60) % 60).toString();
    while (seconds.length < 2) {
        seconds = '0' + seconds;
    }
    var minutes = Math.floor(gameTime / 3600);
    timeText.setText(minutes + ":" + seconds)

    if (powerUp) {
		powerUpTime --;
		if (powerUpTime < 0) {
			powerUp.visible = true;
		}
		else {
			powerUp.visible = false;
		}
		
        powerUp.tint = Math.floor(0xFFFFFF * Math.random())
        powerUp.x += powerUp.xSpeed;
        powerUp.y += powerUp.ySpeed;
        if (powerUp.left < 0) {
            powerUp.xSpeed = Math.abs(powerUp.xSpeed);
        }
        else if (powerUp.right > game.width) {
            powerUp.xSpeed = -Math.abs(powerUp.xSpeed);
        }
        if (powerUp.top < 0) {
            powerUp.ySpeed = Math.abs(powerUp.ySpeed);
        }
        else if (powerUp.bottom > game.height) {
            powerUp.ySpeed = -Math.abs(powerUp.ySpeed);
        }
    }

    var j;
    // update players
    for (var i = 0; i < players.length; i ++) {
        if (player.deadCount > 0) {
            player.deadCount --;
            if (player.deadCount <= 0) {
                makePlayerVulnerable(player);
            }
        }
        player = players[i];
        sprite = players[i].sprite;
        keys = players[i].keys;

        var curSpeed = playerSpeed * player.speedScale;
        if ((keys.down.isDown || keys.up.isDown) && (keys.left.isDown || keys.right.isDown)) {
            curSpeed /= Math.sqrt(2);
        }
        
        // vertical movement
        if (keys.down.isDown) {
            sprite.y += curSpeed;
        }
        if (keys.up.isDown) {
            sprite.y -= curSpeed;
        }
        // force the player to be within the game boundaries
        if (sprite.y < 0) {
            sprite.y = 0;
        }
        else if (sprite.y + sprite.height > game.height) {
            sprite.y = game.height - sprite.height;
        }
        
        // horizontal movement
        if (keys.right.isDown) {
            sprite.x += curSpeed;
        }
        if (keys.left.isDown) {
            sprite.x -= curSpeed;
        }
        // force the player to be within the game boundaries
        if (sprite.x < 0) {
            sprite.x = 0;
        }
        else if (sprite.x + sprite.width > game.width) {
            sprite.x = game.width - sprite.width;
        }
        
        // check collisions
        if (player.powerUp == "mega") {
            for (j = 0; j < players.length; j ++) {
                // don't check collisions with the same player
                if (i == j) {
                    continue;
                }
                if (players[j].deadCount > 0) {
                    continue;
                }
                
                // If the players touch, move the new player to a random position
                // It's in a while loop because there's a small chance the player
                // will be moved so that they still touch. If this happens, it'll
                // try again.
                if (spritesTouching(player.sprite, players[j].sprite)) {
                    // We've just attacked a player.
                    player.score += 73
                    updateScore(player)

                    makePlayerDead(players[j]);
                    while (spritesTouching(player.sprite, players[j].sprite) ||
                        (powerUp != null && spritesTouching(powerUp, players[j].sprite))) {

                        players[j].sprite.x = (game.width - players[j].sprite.width) * Math.random();
                        players[j].sprite.y = (game.height - players[j].sprite.height) * Math.random();
                    }
                }
            }
        }

        if (powerUp != null && powerUp.visible && spritesTouching(player.sprite, powerUp)) {
            for (j = 0; j < players.length; j ++) {
                makePlayerRegular(players[j]);
            }
            makePlayerMega(player);
            randomisePowerUp();
            powerUpTime = 1 * 60;
            powerUp.visible = false;
        }
    }
}