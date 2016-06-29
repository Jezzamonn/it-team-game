var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create });

function preload() {

    game.load.image('player1', 'p1.png');

}

function create() {

    game.stage.backgroundColor = '#3433bb';
    //  This simply creates a sprite using the mushroom image we loaded above and positions it at 200 x 200
    var test = game.add.sprite(200, 200, 'player1');

}