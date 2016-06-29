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
    // TODO: Make the number of players selectable somewher, somehow
    players = [];
    
    // Create a new object, storing information for each player
    players[0] = {
        sprite: game.add.sprite(200, 200, 'player1'),
        keys: game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.W,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A,
            'right': Phaser.KeyCode.D
        })
    }
    players[1] = {
        sprite: game.add.sprite(400, 400, 'player1'),
        keys: game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.UP,
            'down': Phaser.KeyCode.DOWN,
            'left': Phaser.KeyCode.LEFT,
            'right': Phaser.KeyCode.RIGHT
        })
    }
}

function update() {
    for (var i = 0; i < players.length; i ++) {
        sprite = players[i].sprite;
        keys = players[i].keys;
        if (keys.down.isDown) {
            sprite.y += playerSpeed;
        }
        if (keys.up.isDown) {
            sprite.y -= playerSpeed;
        }
        if (keys.right.isDown) {
            sprite.x += playerSpeed;
        }
        if (keys.left.isDown) {
            sprite.x -= playerSpeed;
        }
    }
}