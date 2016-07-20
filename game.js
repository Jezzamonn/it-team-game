var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update });

var playerSpeed = 7;
var powerUpSpeed = 2;

var players;
var powerUp;

var gameTime = 0;
var timeText;

var gameOverText;

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
    timeText = game.add.text(game.width / 2, 0, "0:00", timeTextStyle)
    startGame();
}

//------------------------------------------------
//              STATE TRANSITIONS
//------------------------------------------------
function startGame() {
    initialisePlayers();
    initialisePowerUp();
    gameTime = 1.5 * 60 * 60;
}

function endGame() {
    for (var i = 0; i < players.length; i ++) {
        players[i].sprite.destroy();
    }
    powerUp.destroy();
    //game.input.keyboard.destroy();
}

function startTitle() {

}

function endTitle() {

}

function startGameOver() {

}

function endGameOver() {

}

function initialisePowerUp() {
    powerUp = game.add.sprite(game.width / 2, game.height / 2, 'powerup')
    powerUp.scale.setTo(0.1, 0.1);
    powerUp.xSpeed = 0;
    powerUp.ySpeed = 0;
}

function initialisePlayers() {
    // TODO: Make the number of players selectable somewhere, somehow
    
    // This creates all the players with one big array literal.
    // Could bit made a little more modular, but on the whole it's ok.
    players = [
        createPlayer('player1', ['UP', 'LEFT', 'DOWN', 'RIGHT'], 'red', false, false),
        createPlayer('player2', ['W', 'A', 'S', 'D'], 'green', false, true),
        createPlayer('player3', ['I', 'J', 'K', 'L'], '#0077FF', true, false),
        createPlayer('player4', ['T', 'F', 'G', 'H'], 'purple', true, true),
    ]
    
    //makePlayerMega(players[0]);
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
    gameTime --;
    var seconds = (Math.floor(gameTime / 60) % 60).toString();
    while (seconds.length < 2) {
        seconds = '0' + seconds;
    }
    var minutes = Math.floor(gameTime / 3600);
    timeText.setText(minutes + ":" + seconds)

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
        
        // vertical movement
        if (keys.down.isDown) {
            sprite.y += playerSpeed * player.speedScale;
        }
        if (keys.up.isDown) {
            sprite.y -= playerSpeed * player.speedScale;
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
            sprite.x += playerSpeed * player.speedScale;
        }
        if (keys.left.isDown) {
            sprite.x -= playerSpeed * player.speedScale;
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
                    while (spritesTouching(player.sprite, players[j].sprite) || spritesTouching(powerUp, players[j].sprite)) {
                        players[j].sprite.x = (game.width - players[j].sprite.width) * Math.random();
                        players[j].sprite.y = (game.height - players[j].sprite.height) * Math.random();
                    }
                }
            }
        }

        if (spritesTouching(player.sprite, powerUp)) {
            for (j = 0; j < players.length; j ++) {
                makePlayerRegular(players[j]);
            }
            makePlayerMega(player);
            randomisePowerUp();
        }
    }
}