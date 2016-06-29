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
    
        // player 1
        {
            sprite: game.add.sprite(0, 0, 'player1'),
            keys: game.input.keyboard.addKeys({
                'up':    Phaser.KeyCode.UP,
                'left':  Phaser.KeyCode.LEFT,
                'down':  Phaser.KeyCode.DOWN,
                'right': Phaser.KeyCode.RIGHT,
            })
        },
    
        // player 2
        {
            sprite: game.add.sprite(600, 0, 'player1'),
            keys: game.input.keyboard.addKeys({
                'up':    Phaser.KeyCode.W,
                'left':  Phaser.KeyCode.A,
                'down':  Phaser.KeyCode.S,
                'right': Phaser.KeyCode.D,
            })
        },
    
        // player 3
        {
            sprite: game.add.sprite(0, 400, 'player1'),
            keys: game.input.keyboard.addKeys({
                'up':    Phaser.KeyCode.I,
                'left':  Phaser.KeyCode.J,
                'down':  Phaser.KeyCode.K,
                'right': Phaser.KeyCode.L,
            })
        },
    
        // player 4
        {
            sprite: game.add.sprite(600, 400, 'player1'),
            keys: game.input.keyboard.addKeys({
                'up':    Phaser.KeyCode.G,
                'left':  Phaser.KeyCode.V,
                'down':  Phaser.KeyCode.B,
                'right': Phaser.KeyCode.N,
            })
        },
    ]
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