var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update });

var playerSpeed = 5;

var player;
var keys;

function preload() {

    game.load.image('player1', 'p1.png');
    
    keys = game.input.keyboard.createCursorKeys();
}

function create() {

    game.stage.backgroundColor = '#3433bb';
    //  This simply creates a sprite using the mushroom image we loaded above and positions it at 200 x 200
    player = game.add.sprite(200, 200, 'player1');

}

function update() {
    if (keys.down.isDown) {
        player.y += playerSpeed;
    }
    if (keys.up.isDown) {
        player.y -= playerSpeed;
    }
    if (keys.right.isDown) {
        player.x += playerSpeed;
    }
    if (keys.left.isDown) {
        player.x -= playerSpeed;
    }
}