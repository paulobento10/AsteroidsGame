BasicGame.MainMenu = function(game) {
    this.game = game;
    this.version_number = '1.0';
};

var title;
var buttons;


var menuTheme = new Howl({
    src: ['assets/gamesound.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.1,
});

var enter;
var counter;
var selector_bracket_left;
var selector_bracket_right;
var button_selected;
var buttons_done;

var esq;



BasicGame.MainMenu.prototype = {

    create: function() {
        counter = 0;
        var bg = this.game.add.sprite(0, 0, 'bg');

        var emitter = this.game.add.emitter(this.game.world.centerX, 0, 100, 100);
        emitter.width = this.game.world.width;
        emitter.makeParticles('particle');

        emitter.minParticleSpeed.setTo(-300, 30);
        emitter.maxParticleSpeed.setTo(300, 100);
        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.5;
        emitter.gravity = 1250;
        emitter.flow(2000, 500, 5, -1);



        buttons_done = false;
        title = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'title');
        title.scale.setTo(0.06,0.06);
        title.anchor.setTo(0.5, 0.5);
        title.alpha = 0;

        this.game.add.tween(title).to({ alpha: 1 }, 1700, "Quart.easeOut", true);

        var titleTween = this.game.add.tween(title).to({ x: this.game.world.centerX, y: this.game.world.centerY - 80 }, 1700, "Quart.easeOut", true);

        titleTween.onComplete.add(function() {
            this.initButtons();
            buttons_done = true;
        }, this);
          var bottomText = this.game.add.bitmapText(32, this.game.world.height - 64, 'carrier_command', 'version ' + this.version_number, 8);
    },


    initButtons: function() {


        var buttonText = ['OPTIONS', 'PLAY', 'CREDITS'];
        buttons = [];

        button_selected = 1;

        var up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        var down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        esq = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);


        for (var i = 0; i < buttonText.length; i++) {
            var text = this.game.add.bitmapText(0, 0, 'carrier_command', buttonText[i], 18);
            text.anchor.setTo(0.5, 0.5);
            text.inputEnabled = true;
            text.alpha = 0;
            this.game.add.tween(text).to({ x: this.game.world.centerX, y: 210 + this.game.world.centerX - i * 60}, 1700, "Quart.easeOut", true);
            this.game.add.tween(text).to({ alpha: 1 }, 2000, "Quart.easeOut", true);

            buttons.push(text);
        }

        buttons[1].events.onInputDown.add(function() {
            this.game.state.start("Game");
            menuTheme.stop();
        }, this);

        buttons[0].events.onInputOver.add(function() {
            button_selected = 0;
        }, this);


        buttons[1].events.onInputOver.add(function() {
            button_selected = 1;
        }, this);

        buttons[2].events.onInputOver.add(function() {
            button_selected = 2;
        }, this);


        selector_bracket_left = this.game.add.bitmapText(0, 0, 'carrier_command', '[ ', 24);
        selector_bracket_right = this.game.add.bitmapText(0, 0, 'carrier_command', ']', 24);
        up.onDown.add(function() {
            button_selected += 1;
        }, this);

        down.onDown.add(function() {
            button_selected -= 1;

        }, this);

    },

    update: function() {

        if (buttons_done) {
            if (button_selected < 0) {
                button_selected = 2;
            } else if (button_selected > 2) {
                button_selected = 0;
            }
            counter++;
            selector_bracket_left.x = buttons[button_selected].x - buttons[button_selected].width / 2 - Math.cos(counter / 25) * 10 - 35;
            selector_bracket_left.y = buttons[button_selected].y - buttons[button_selected].height / 2-4;
            selector_bracket_right.x = buttons[button_selected].x + buttons[button_selected].width / 2 + Math.cos(counter / 25) * 10 + 5;
            selector_bracket_right.y = buttons[button_selected].y - buttons[button_selected].height / 2-4;

            
            if (button_selected == 0 && enter.isDown){
            	tileSprite = this.game.add.tileSprite(0, 0, 800, 600, 'bg2');
                this.add.bitmapText(60,100, 'carrier_command','LEFT  ->\n\nRIGHT <-\n\nUP    - Fire\n\nEsq   - Pause\n\nSpace - Restart',9);
                this.add.bitmapText(70,450, 'carrier_command','[ ESQ (Menu) ]',9);
                
            }else if(button_selected == 1 && enter.isDown){
            	this.game.state.start('Game');
            }else if(button_selected == 2 && enter.isDown){
            	tileSprite = this.game.add.tileSprite(0, 0, 800, 600, 'bg2');
                this.add.bitmapText(10,100, 'carrier_command','Uma grande missao a\n\nconquistar no Asteroids -\n\na de salvar o planeta Terra\n\nde ser atingida por asteroides\n\ne, ainda, de uma invasao de\n\nextraterrestres.\n\nAssim, a nave espacial esta\n\nencarregue de destruir estes\n\ninimigos e salvar o planeta\n\nTerra e todos os seus habitantes.',7);
                this.add.bitmapText(10,350, 'carrier_command','Paulo Bento n33959\n\nRafael Rodrigues n34204',9);
                this.add.bitmapText(70,450, 'carrier_command','[ ESQ (Menu) ]',9);
            }else if(esq.isDown) this.game.state.start('MainMenu');
            
        }


    }
};
