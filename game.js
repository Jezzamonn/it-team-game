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
}

function createPlayer(spriteName, keyNames) {
    player = {
        sprite: game.add.sprite(0, 0, 'player1'),
        keys: game.input.keyboard.addKeys({
            'up':    Phaser.KeyCode[keyNames[0]],
            'left':  Phaser.KeyCode[keyNames[1]],
            'down':  Phaser.KeyCode[keyNames[2]],
            'right': Phaser.KeyCode[keyNames[3]],
        })
    }
    player.sprite.scale.setTo(0.2, 0.2)
    return player;
}

function update() {
    for (var i = 0; i < players.length; i ++) {
        sprite = players[i].sprite;
        keys = players[i].keys;
        
        // vertical movement
        if (keys.down.isDown) {
            sprite.y += playerSpeed;
        }
        if (keys.up.isDown) {
            sprite.y -= playerSpeed;
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
            sprite.x += playerSpeed;
        }
        if (keys.left.isDown) {
            sprite.x -= playerSpeed;
        }
        // force the player to be within the game boundaries
        if (sprite.x < 0) {
            sprite.x = 0;
        }
        else if (sprite.x + sprite.width > game.width) {
            sprite.x = game.width - sprite.width;
        }
    }
}