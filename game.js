var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create });

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
        player.y += 1;
    }
    if (keys.up.isDown) {
        player.y -= 1;
    }
    if (keys.right.isDown) {
        player.x += 1;
    }
    if (keys.left.isDown) {
        player.x -= 1;
    }
}