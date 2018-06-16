BasicGame.Preloader = function(game) {
    this.background = null;
    this.preloadBar = null;
    this.ready = false;
};
BasicGame.Preloader.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.time.advancedTiming = true;
        this.load.setPreloadSprite(this.preloadBar);
        //this.load.image('tileset', 'assets/tileset.png');

        //this.load.tilemap('intro', 'assets/intro.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('title', 'assets/title.png');
        this.load.image('bg', 'assets/bg.png');
        this.load.image('particle', 'assets/particle.png');



        //this.load.image('hero','assets/hero.png');
        this.load.audio('blaster', 'assets/blaster.mp3');
        this.load.audio('shot2', 'assets/shot2.wav');
        this.load.audio('explosion', 'assets/explosion.mp3');
        this.load.audio('reload', 'assets/door_open.wav');
        this.load.audio('player_death', 'assets/player_death.wav');

        this.load.image('bg1', 'assets/space.png');
        this.load.image('bg2', 'assets/deepspace.jpg');

        this.load.image('bullet', 'assets/bullets.png');
        this.load.image('recharge', 'assets/missile.png');
        this.load.image('invader','assets/invader.png');
        this.load.image('bossBullet1','assets/bullet208.png');
        this.load.image('bossBullet2','assets/bullet211.png');
        this.load.image('bossBullet3','assets/bullet214.png');
        this.load.image('asteroid1','assets/asteroid1.png');
        this.load.image('asteroid2','assets/asteroid2.png');
        this.load.image('asteroid3','assets/asteroid3.png');
        this.load.image('asteroid4','assets/asteroid4.png');
        this.load.image('asteroid5','assets/asteroid5.png');
        this.load.image('asteroid6','assets/asteroid6.png');
        this.load.image('asteroid7','assets/asteroid7.png');
        this.load.image('asteroid8','assets/asteroid8.png');
        this.load.image('asteroid9','assets/asteroid9.png');
        this.load.image('asteroid10','assets/asteroid10.png');
        this.load.image('asteroid11','assets/asteroid11.png');
        this.load.bitmapFont('carrier_command','assets/fonts/carrier_command.png','assets/fonts/carrier_command.xml');
        this.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
        this.load.spritesheet('hero','assets/sh2.png',100,100);
        //this.load.image('mask', 'assets/mask.png');
        //novo nivel
        //game.load.image('enemyBullet', 'assets/enemyBullet.png');
        //game.load.spritesheet('invader', 'assets/invader32x32x4.png', 32, 32);
        //game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);

    },
    create: function() {
        this.state.start('MainMenu');
    }
};
