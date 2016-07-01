var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update });

var playerSpeed = 5;

var players;

function preload() {

    game.load.image('player1', 'p1.png');
    
    keys = game.input.keyboard.createCursorKeys();
}

function create() {

    game.stage.backgroundColor = '5F3C73';
    
    initialisePlayers();
    
}

function initialisePlayers() {
    // TODO: Make the number of players selectable somewhere, somehow
    
    // This creates all the players with one big array literal.
    // Could bit made a little more modular, but on the whole it's ok.
    players = [
        createPlayer('player1', ['UP', 'LEFT', 'DOWN', 'RIGHT']),
        createPlayer('player1', ['W', 'A', 'S', 'D']),
        createPlayer('player1', ['I', 'J', 'K', 'L']),
        createPlayer('player1', ['G', 'V', 'B', 'N']),
    ]
    
    // Space out the players
    players[1].sprite.x = game.width - players[1].sprite.width;
    players[2].sprite.y = game.height - players[2].sprite.height;
    players[3].sprite.x = game.width - players[3].sprite.width;
    players[3].sprite.y = game.height - players[3].sprite.height;
    
    makePlayerMega(players[0]);
}

function createPlayer(spriteName, keyNames) {
    player = {
        sprite: game.add.sprite(0, 0, 'player1'),
        keys: game.input.keyboard.addKeys({
            'up':    Phaser.KeyCode[keyNames[0]],
            'left':  Phaser.KeyCode[keyNames[1]],
            'down':  Phaser.KeyCode[keyNames[2]],
            'right': Phaser.KeyCode[keyNames[3]],
        }),
        speedScale: 1.0,
        powerUp: null,
    }
    makePlayerRegular(player)
    return player;
}

function makePlayerRegular(player) {
    player.sprite.scale.setTo(0.2, 0.2);
    player.speedScale = 1.0;
    player.powerUp = null;
}

function makePlayerMega(player) {
    player.sprite.scale.setTo(0.4, 0.4);
    player.speedScale = 1.2;
    player.powerUp = "mega";
}

function playersTouching(player1, player2) {
    // This is a simple test to see whether two rectangles overlap.
    return player1.sprite.right > player2.sprite.left &&
           player2.sprite.right > player1.sprite.left &&
           player1.sprite.bottom > player2.sprite.top &&
           player2.sprite.bottom > player1.sprite.top;
}

function update() {
    for (var i = 0; i < players.length; i ++) {
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
            for (var j = 0; j < players.length; j ++) {
                // don't check collisions with the same player
                if (i == j) {
                    continue;
                }
                
                // If the players touch, move the new player to a random position
                // It's in a while loop because there's a small chance the player
                // will be moved so that they still touch. If this happens, it'll
                // try again.
                while (playersTouching(player, players[j])) {
                    players[j].sprite.x = (game.width - players[j].sprite.width) * Math.random();
                    players[j].sprite.y = (game.height - players[j].sprite.height) * Math.random();
                }
            }
        }
    }
}